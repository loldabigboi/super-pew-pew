class GameScene extends Scene {

    constructor() {

        super();

        const physicsSystem = new PhysicsSystem();

        this.addSystem(physicsSystem, 1);
        this.addSystem(new BasicEnemyAISystem(physicsSystem.world), 1);
        this.addSystem(new ProjectileWeaponSystem(), 2);
        this.addSystem(new ProjectileSystem(physicsSystem.world), 2);
        this.addSystem(new JumpSystem(physicsSystem.world), 2);
        this.addSystem(new TeleporterSystem(physicsSystem.world), 2);
        this.addSystem(new ContactDamageSystem(physicsSystem.world), 2);
        this.addSystem(new RenderSystem(), 3);
        this.addSystem(new FatalDependencySystem(), 4);
        this.addSystem(new DelayedCallbackSystem(), 5);
        this.addSystem(new RepeatingCallbackSystem(), 5);
        this.addSystem(new LoopCallbackSystem(), 5);
        this.addSystem(new ParentSystem(), 5);

        physicsSystem.world.addContactMaterial(new p2.ContactMaterial(ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL, GameScene.OBSTACLE_MATERIAL, {
            restitution : 1.0,
            friction: 0,
            stiffness : Number.MAX_VALUE // We need infinite stiffness to get exact restitution
        }));
        physicsSystem.world.addContactMaterial(new p2.ContactMaterial(ProjectileWeaponComponent.LOSS_BOUNCE_MATERIAL, GameScene.OBSTACLE_MATERIAL, {
            restitution : 0.6,
            friction: 0,
            stiffness : Number.MAX_VALUE // We need infinite stiffness to get exact restitution
        }));
        physicsSystem.world.addContactMaterial(new p2.ContactMaterial(GameScene.CHARACTER_MATERIAL, GameScene.OBSTACLE_MATERIAL, {
            restitution : 0.05,
            friction: 0.5,
            relaxation: 8,  //  get rid of residual bouncing effect
        }));
        physicsSystem.world.addContactMaterial(new p2.ContactMaterial(GameScene.CHARACTER_MATERIAL, GameScene.CHARACTER_MATERIAL, {
            restitution : 0,
            friction: 0,
            relaxation: 10, //  get rid of residual bouncing effect
        }));

        this.platformIDs = [];
        this.lastPlatformI = 2;
        this.score = 0;

        this.createTeleporters();
        this.createPlatforms();
        this.createPlayer();
        this.createWeaponCrate();

        // create guns
        this.weapons = [
            WeaponFactory.createPistol(Entity.GENERATE_ID(), this.playerID),
            WeaponFactory.createMachineGun(Entity.GENERATE_ID(), this.playerID),
            WeaponFactory.createMinigun(Entity.GENERATE_ID(), this.playerID), 
            WeaponFactory.createShotgun(Entity.GENERATE_ID(), this.playerID),
            WeaponFactory.createRocketLauncher(Entity.GENERATE_ID(), this.playerID, this.entities),
            WeaponFactory.createGrenadeLauncher(Entity.GENERATE_ID(), this.playerID),
        ];

        // equip gun
        this.nextWeapon = this.weapons[Math.floor(Math.random() * this.weapons.length)];
        this.equipNextWeapon();

        InputManager.addListener('keydown', (key, evt) => {
            if (key.code === InputManager.fromChar('r').code && !this.entities[this.playerID]) {
                this.createPlayer();
                this.equipNextWeapon();
            }
        });

        InputManager.addListener('mousedown', (mouse, evt) => {
            this.addEvent(new TransmittedEvent(null, this.currWeapon[WeaponComponent].entityID, ProjectileWeaponSystem,
                ProjectileWeaponSystem.FIRE_WEAPON_EVENT, {}));
        })

        this.lastSpawn = 0;
        this.spawnDir = 1;
        this.currSpawnDelay = 0;
        this.currentSpawnRotation = this.getSpawnRotation();
        this.spawnI = 0;

        this.screenShake = 0;  // used to set RenderSystem's tempOffset to simulate screen shake
        this.screenShakeDamping = 0.9; // how quickly the screen shake decreases

    }

    getSpawnRotation() {
        return GameScene.SpawnRotations[Math.floor(Math.random()*GameScene.SpawnRotations.length)]
    }

    spawnEnemies(now) {

        this.lastSpawn = now;

        const type = this.currentSpawnRotation.spawnTypes[this.spawnI];
        this.currSpawnDelay = this.currentSpawnRotation.spawnDelays[this.spawnI];

        const entityID = Entity.GENERATE_ID();
        let c;
        if (type == GameScene.EnemyTypes.REGULAR) {
            c = BasicEnemyFactory.createEnemy(entityID, [canvas.width/2, 0], 30*this.spawnDir, 40, 3, 1);
        } else if (type == GameScene.EnemyTypes.BIG) {
            c = BasicEnemyFactory.createEnemy(entityID, [canvas.width/2, 0], 30*this.spawnDir, 60, 12, 3);
            c[RenderComponent].stroke = 'black';
            c[RenderComponent].fill = 'rgb(200,0,0)';
        } else {
            throw new Error();
        }

        this.addEntity(entityID, c); 

        this.spawnI++;

        if (this.spawnI >= this.currentSpawnRotation.spawnTypes.length) {
            this.spawnDir = Math.random < 0.5 ? -1 : 1;
            this.spawnI = 0;
            this.currentSpawnRotation = this.getSpawnRotation();
        }

    }

    update(dt) {

        this.firing = false;
        if (!this.currWeapon[WeaponComponent].semiAuto && InputManager.mouse.down) {
            this.firing = true;
            this.addEvent(new TransmittedEvent(null, this.currWeapon[WeaponComponent].entityID, ProjectileWeaponSystem,
                ProjectileWeaponSystem.FIRE_WEAPON_EVENT, {}));
        }

        const now = Date.now();
        if (now - this.lastSpawn > this.currSpawnDelay) {
            this.spawnEnemies(now);
        }

        let newTempOffset = [0,0];
        p2.vec2.rotate(newTempOffset, [this.screenShake, 0], Math.random()*Math.PI*2);
        this.screenShake *= this.screenShakeDamping;

        this.systemsDict[RenderSystem].tempOffset = newTempOffset;
        super.update(dt);

    }

    createPlatforms() {

        const canvas = document.getElementsByTagName("canvas")[0];

        let w = 8, h = canvas.height;

        const groups = ShapeComponent.GROUPS,
              masks = ShapeComponent.MASKS;

        // add platforms to contain sides of arena

        let entityID = Entity.GENERATE_ID();
        let compDict = PlatformFactory.createPlatform(entityID, w, h, [w/2, h/2], 0);
        this.addEntity(entityID, compDict);

        entityID = Entity.GENERATE_ID();
        compDict = PlatformFactory.createPlatform(entityID, w, h, [canvas.width - w/2, h/2], 0);
        this.addEntity(entityID, compDict);

        // add boxes to contain bottom and top with hole in middle
        w = canvas.width/2 - 59;
        h = 8;

        entityID = Entity.GENERATE_ID();
        compDict = PlatformFactory.createPlatform(entityID, w, h, [w/2-1, h/2 -1 ], 0);
        this.addEntity(entityID, compDict);

        entityID = Entity.GENERATE_ID();
        compDict = PlatformFactory.createPlatform(entityID, w, h, [canvas.width - w/2+1, h/2 - 1], 0);
        this.addEntity(entityID, compDict);

        entityID = Entity.GENERATE_ID();
        compDict = PlatformFactory.createPlatform(entityID, w, h, [w/2-1, canvas.height - h/2 + 1], 0);
        this.addEntity(entityID, compDict);
        this.platformIDs.push(entityID);

        entityID = Entity.GENERATE_ID();
        compDict = PlatformFactory.createPlatform(entityID, w, h, [canvas.width - w/2+1, canvas.height - h/2 + 1], 0);
        this.addEntity(entityID, compDict);
        this.platformIDs.push(entityID);

        const positionArray = [
            [canvas.width/2, canvas.height-125],
            [124, 325],
            [canvas.width-124, 325],
            [canvas.width/2, 175]
        ];
        const widthArray = [
            400, 250, 250, 400
        ];

        for (let i = 0; i < positionArray.length; i++) {
            entityID = Entity.GENERATE_ID();
            compDict = PlatformFactory.createPlatform(entityID, widthArray[i], 20, positionArray[i], 0);
            this.addEntity(entityID, compDict);
            this.platformIDs.push(entityID);
        }

    }

    createTeleporters() {

        const canvas = document.getElementsByTagName("canvas")[0];

        const groups = ShapeComponent.GROUPS,
              masks = ShapeComponent.MASKS;

        const entityID = Entity.GENERATE_ID();
        const shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {
            width: 300,
            height: 50
        }, [0,0], [0,0], 0, groups.TELE, masks.GROUND)
        const phyComp = new PhysicsComponent(entityID,  {
            mass: 0,
            collisionResponse: false, 
            position: [canvas.width/2, canvas.height + 100],
        }, [shapeComp]);
        const teleComp = new TeleporterComponent(entityID, [canvas.width/2, 0]);
        const componentsDict = {};
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[TeleporterComponent] = teleComp;
        componentsDict[PhysicsComponent] = phyComp;

        this.addEntity(entityID, componentsDict);

    }

    createWeaponCrate() {

        const groups = ShapeComponent.GROUPS,
              masks = ShapeComponent.MASKS;

        const entityID = Entity.GENERATE_ID();
        const shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {
            width: 30,
            height: 30
        }, [0,0], [0,0], 0, groups.PICKUP, masks.PICKUP, groups.PLAYER);
        const phyComp = new PhysicsComponent(entityID,  {
            mass: 1,
            position: [0, 0],
            fixedRotation: true
        }, [shapeComp]);
        const renComp = new RenderComponent(entityID, 'gold', 'gold', 1, GameScene.WEAPON_LAYER);
        const componentsDict = {};
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[HealthComponent] = new HealthComponent(entityID, 1, undefined, () => this.pickupWeaponCrate());
        componentsDict[RenderComponent] = renComp;
        componentsDict[PhysicsComponent] = phyComp;

        this.weaponCrate = componentsDict;
        this.repositionWeaponCrate();
        this.addEntity(entityID, componentsDict);

    }

    repositionWeaponCrate() {

        let newPlatformI = Math.floor(Math.random() * this.platformIDs.length);
        while (newPlatformI == this.lastPlatformI) {
            newPlatformI = Math.floor(Math.random() * this.platformIDs.length);
        }
        this.lastPlatformI = newPlatformI;

        const platform = this.entities[this.platformIDs[newPlatformI]];

        const platformBody = platform[PhysicsComponent].body;
        const w = platformBody.shapes[0].width;
        this.weaponCrate[PhysicsComponent].body.position = [platformBody.position[0] + (-w/2 + Math.random() * w) * 0.75,
                                                            platformBody.position[1] - 75];

    }

    pickupWeaponCrate() {

        console.log(++this.score);
        this.equipNextWeapon();
        this.repositionWeaponCrate();
        
    }

    createPlayer() {

        const groups = ShapeComponent.GROUPS,
              masks = ShapeComponent.MASKS;

        let entityID = Entity.GENERATE_ID();
        this.playerID = entityID;

        const shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: 30, height: 30}, [0,0], [0,0], 0, 
            groups.PLAYER, masks.PLAYER, g.ENEMY | g.PICKUP, GameScene.CHARACTER_MATERIAL)
        const phyComp = new PhysicsComponent(entityID, {
            mass: 100, 
            position: [canvas.width/2, canvas.height/2],
            fixedRotation: true,
            gravityScale: 2
        }, [shapeComp]);
        const healthComp = new HealthComponent(entityID, 1, Callbacks.DELETE_ENTITY);
        const jumpComp = new JumpComponent(entityID, [6000, 6000, 6000]);
        const contactComp = new ContactDamageComponent(entityID, 1, Infinity, undefined, groups.PICKUP);

        const renComp = new RenderComponent(entityID, 'blue', 'blue', 1, GameScene.PLAYER_LAYER);
        
        let callbackComponent = new LoopCallbackComponent(entityID, (componentsDict, dt) => {

            let dx = 0;
            if (InputManager.fromChar('a').down) {
                dx = -35;
            } else if (InputManager.fromChar('d').down) {
                dx = 35;
            }

            phyComp.body.velocity[0] = dx;
            // if (!this.firing && this.playerMoving) {
            //     phyComp.body.velocity[0] = dx;
            // } else if (dx) {
            //     phyComp.body.applyImpulse([dx*5, 0]);
            // }

            this.playerMoving = dx != 0;

        });
        
        let componentsDict = {};
        componentsDict[RenderComponent] = renComp;
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[ContactDamageComponent] = contactComp;
        componentsDict[PhysicsComponent] = phyComp;
        componentsDict[JumpComponent] = jumpComp;
        componentsDict[HealthComponent] = healthComp;
        componentsDict[LoopCallbackComponent] = [callbackComponent];

        this.addEntity(entityID, componentsDict);

        const jumpListener = (key, event) => {
            if (key.code === InputManager.fromChar('w').code) {
                this.addEvent(new TransmittedEvent(this.playerID, this.playerID, JumpSystem, JumpSystem.JUMP_REQUEST));
            }
        };
        InputManager.addListener('keydown', jumpListener);
        this.addEntityCallback(this.playerID, 'postDeletion', () => {
            InputManager.removeListener('keydown', jumpListener);
        });
        
    }

    equipNextWeapon() {

        if (this.currWeapon) {
            const currID = this.currWeapon[WeaponComponent].entityID;
            this.addEvent(new TransmittedEvent(null, currID, null, Scene.DELETE_ENTITY_EVENT, {}));
        }

        this.currWeapon = this.nextWeapon;
        const entityID = this.currWeapon[WeaponComponent].entityID;
        this.currWeapon[LoopCallbackComponent] = [new LoopCallbackComponent(entityID, (dt, components) => {
            const mousePos = [InputManager.mouse.x, InputManager.mouse.y];
            const gunPos = ParentComponent.getAbsolutePosition(entityID, this.entities);
            const vec = [mousePos[0] - gunPos[0], mousePos[1] - gunPos[1]];
            this.currWeapon[TransformComponent].angle = Math.atan2(vec[1], vec[0]);
        })];
        this.currWeapon[ParentComponent].parentID = this.playerID;
        this.currWeapon[WeaponComponent].onUse = (obj) => {
            const c = obj.components;
            const playerC = this.entities[this.playerID];

            let kickbackVel = [];
            p2.vec2.rotate(kickbackVel, [-c[ProjectileWeaponComponent].kickback, 0], c[TransformComponent].angle);
            
            playerC[PhysicsComponent].body.applyImpulse(kickbackVel);
        }
        
        this.addEvent(new TransmittedEvent(null, entityID, null, Scene.ADD_ENTITY_EVENT, {components: this.currWeapon}));
        
        const diffWeapons = this.weapons.filter((wep) => wep != this.currWeapon);
        this.nextWeapon = diffWeapons[Math.floor(Math.random() * diffWeapons.length)];

    }

}

GameScene.SpawnRotation = class {
    
    constructor(spawnTypes, spawnDelays) {
        this.spawnTypes = spawnTypes;
        this.spawnDelays = spawnDelays;
    }

}

GameScene.EnemyTypes = {
    REGULAR: 0,
    BIG: 1
}

const reg = GameScene.EnemyTypes.REGULAR,
      big = GameScene.EnemyTypes.BIG;
GameScene.SpawnRotations = [
    new GameScene.SpawnRotation([reg], [1000]),
    new GameScene.SpawnRotation([reg, reg, reg], [300, 300, 3500]),
    new GameScene.SpawnRotation([big], [2500]),
    new GameScene.SpawnRotation([reg, big, reg], [300, 300, 5000]),
    new GameScene.SpawnRotation([big, big], [1000, 5000]),
    // 5: new GameScene.SpawnRotation([reg], [], 50),
    // 6: new GameScene.SpawnRotation([reg], [], 50),
    // 7: new GameScene.SpawnRotation([reg], [], 50),
    // 8: new GameScene.SpawnRotation([reg], [], 50)
]

GameScene.CHARACTER_MATERIAL = new p2.Material();
GameScene.OBSTACLE_MATERIAL = new p2.Material();

GameScene.BACKGROUND_LAYER = 0;
GameScene.GROUND_LAYER = 1;
GameScene.PROJ_LAYER = 2;
GameScene.PLAYER_LAYER = 3;
GameScene.WEAPON_LAYER = 4;
GameScene.ENEMY_LAYER = 5;