class GameScene extends Scene {

    constructor() {

        super();

        const canvas = document.getElementsByTagName("canvas")[0];
        canvas.width = 1000;
        canvas.height = 600;

        const physicsSystem = new PhysicsSystem();
        const loopSystem = new LoopCallbackSystem();
        const enemyAISystem = new BasicEnemyAISystem(physicsSystem.world);
        const teleportSystem = new TeleporterSystem(physicsSystem.world);
        const jumpSystem = new JumpSystem(physicsSystem.world);
        const lifetimeSystem = new LifetimeSystem();
        const fatalSystem = new FatalDependencySystem();
        const contactSystem = new ContactDamageSystem(physicsSystem.world);
        const projectileSystem = new ProjectileSystem(physicsSystem.world);
        const projectileWeaponSystem = new ProjectileWeaponSystem();
        const trackingSystem = new TrackingSystem();
        const renderSystem = new RenderSystem();

        this.addSystem(loopSystem, 0);
        this.addSystem(physicsSystem, 1);
        this.addSystem(enemyAISystem, 1);
        this.addSystem(trackingSystem, 2);
        this.addSystem(projectileSystem, 2);
        this.addSystem(jumpSystem, 2);
        this.addSystem(teleportSystem, 2);
        this.addSystem(lifetimeSystem, 2);
        this.addSystem(contactSystem, 2);
        this.addSystem(projectileWeaponSystem, 2);
        this.addSystem(renderSystem, 3);
        this.addSystem(fatalSystem, 4);

        physicsSystem.world.addContactMaterial(new p2.ContactMaterial(ProjectileWeaponComponent.BULLET_MATERIAL, GameScene.OBSTACLE_MATERIAL, {
            restitution : 1.0,
            friction: 0,
            stiffness : Number.MAX_VALUE // We need infinite stiffness to get exact restitution
        }));
        physicsSystem.world.addContactMaterial(new p2.ContactMaterial(GameScene.CHARACTER_MATERIAL, GameScene.OBSTACLE_MATERIAL, {
            restitution : 0,
            friction: 0,
            relaxation: 10,  //  get rid of residual bouncing effect
        }));
        physicsSystem.world.addContactMaterial(new p2.ContactMaterial(GameScene.CHARACTER_MATERIAL, GameScene.CHARACTER_MATERIAL, {
            restitution : 0,
            friction: 0,
            relaxation: 10, //  get rid of residual bouncing effect
        }));

        // for some reason had to employ a hack by access the contact equations directly from the
        // narrow phase, as simply setting the enabled flag wasn't working :/
        physicsSystem.world.on('preSolve', (evt) => {

            const newEqs = [];
            for (const eq of physicsSystem.world.narrowphase.contactEquations) {
                
                const groups = ShapeComponent.GROUPS;

                let enemyShape, otherShape;
                if (eq.shapeA.collisionGroup == groups.ENEMY) {
                    enemyShape = eq.shapeA;
                    otherShape = eq.shapeB;
                } else if (eq.shapeB.collisionGroup == groups.ENEMY) {
                    enemyShape = eq.shapeB;
                    otherShape = eq.shapeA;
                } else {
                    newEqs.push(eq);
                    continue;
                }
                
                if (otherShape.collisionGroup == groups.GROUND ||
                    (!otherShape.collisionGroup == groups.PLAYER &&
                    !otherShape.collisionGroup == groups.PROJ)) {
                    newEqs.push(eq);
                }

            }
            physicsSystem.world.narrowphase.contactEquations = newEqs;

        });

        this.platformIDs = [];

        this.createBorders();
        this.createTeleporters();
        this.createPlatforms();
        this.createPlayer();

        InputManager.addListener('keydown', (key, evt) => {
            if (key.code === InputManager.fromChar('r').code && !this.entities[this.playerID]) {
                this.createPlayer();
            }
        })

        this.lastSpawn = 0;
        this.spawnDir = 1;
        this.currSpawnDelay = 0;
        this.currentSpawnRotation = this.getSpawnRotation();
        this.spawnI = 0;

    }

    getSpawnRotation() {
        return GameScene.SpawnRotations[Math.floor(Math.random()*GameScene.SpawnRotations.length)]
    }

    update(dt) {

        const now = Date.now();
        if (now - this.lastSpawn > this.currSpawnDelay) {
            this.lastSpawn = now;

            const type = this.currentSpawnRotation.spawnTypes[this.spawnI];
            this.currSpawnDelay = this.currentSpawnRotation.spawnDelays[this.spawnI];

            const entityID = Entity.GENERATE_ID();
            let c;
            if (type == GameScene.EnemyTypes.REGULAR) {
                c = BasicEnemyFactory.createEnemy(entityID, [canvas.width/2, 0], 25*this.spawnDir, 40, 2, 1);
            } else if (type == GameScene.EnemyTypes.BIG) {
                c = BasicEnemyFactory.createEnemy(entityID, [canvas.width/2, 0], 25*this.spawnDir, 60, 8, 3);
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
        super.update(dt);

    }

    createBorders() {

        const canvas = document.getElementsByTagName("canvas")[0];

        let w = 8, h = canvas.height;

        const groups = ShapeComponent.GROUPS,
              masks = ShapeComponent.MASKS;

        // add boxes to contain sides
        let entityID = Entity.GENERATE_ID();
        let shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, GameScene.OBSTACLE_MATERIAL)
        let phyComp = new PhysicsComponent(entityID, {position: [w/2, h/2]}, [shapeComp]);
        let renComp = new RenderComponent(entityID, 'white', 'blue', GameScene.GROUND_LAYER);

        let componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[RenderComponent] = renComp;
        componentsDict[PhysicsComponent] = phyComp;
        this.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, GameScene.OBSTACLE_MATERIAL)
        phyComp = new PhysicsComponent(entityID, {position: [canvas.width - w/2, h/2]}, [shapeComp]);
        renComp = new RenderComponent(entityID, 'white', 'blue', GameScene.GROUND_LAYER);

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[RenderComponent] = renComp;
        componentsDict[PhysicsComponent] = phyComp;
        this.addEntity(entityID, componentsDict);

        // add boxes to contain bottom and top with hole in middle
        w = canvas.width/2 - 39;
        h = 8;

        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, GameScene.OBSTACLE_MATERIAL)
        phyComp = new PhysicsComponent(entityID, {position: [w/2-1, h/2-1]}, [shapeComp]);
        renComp = new RenderComponent(entityID, 'white', 'blue', GameScene.GROUND_LAYER);

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        componentsDict[RenderComponent] = renComp;
        this.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, GameScene.OBSTACLE_MATERIAL)
        phyComp = new PhysicsComponent(entityID, {position: [canvas.width - w/2+1, h/2-1]}, [shapeComp]);
        renComp = new RenderComponent(entityID, 'white', 'blue', GameScene.GROUND_LAYER);

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        componentsDict[RenderComponent] = renComp;
        this.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, GameScene.OBSTACLE_MATERIAL)
        phyComp = new PhysicsComponent(entityID, {position: [w/2-1, canvas.height - h/2+1]}, [shapeComp]);
        renComp = new RenderComponent(entityID, 'white', 'blue', GameScene.GROUND_LAYER);

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        componentsDict[RenderComponent] = renComp;
        this.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, GameScene.OBSTACLE_MATERIAL)
        phyComp = new PhysicsComponent(entityID, {position: [canvas.width - w/2+1, canvas.height - h/2+1]}, [shapeComp]);
        renComp = new RenderComponent(entityID, 'white', 'blue', GameScene.GROUND_LAYER);

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        componentsDict[RenderComponent] = renComp;
        this.addEntity(entityID, componentsDict);


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
        const renComp = new RenderComponent(entityID, 'white', 'blue', GameScene.GROUND_LAYER);
        const teleComp = new TeleporterComponent(entityID, [canvas.width/2, 0]);
        const componentsDict = {};
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[RenderComponent] = renComp;
        componentsDict[TeleporterComponent] = teleComp;
        componentsDict[PhysicsComponent] = phyComp;

        this.addEntity(entityID, componentsDict);

    }

    createPlatforms() {

        const canvas = document.getElementsByTagName("canvas")[0];

        const groups = ShapeComponent.GROUPS,
              masks = ShapeComponent.MASKS;

        const positionArray = [
            [canvas.width/2, canvas.height-125],
            [124, 325],
            [canvas.width-124, 325],
            [canvas.width/2, 175]
        ];
        const widthArray = [
            400, 250, 250, 400
        ];

        for (let i = 0; i < 4; i++) {
            const entityID = Entity.GENERATE_ID();
            const shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {
                width: widthArray[i],
                height: 20
            }, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, GameScene.OBSTACLE_MATERIAL)
            const phyComp = new PhysicsComponent(entityID,  {
                mass: 0, 
                position: positionArray[i],
            }, [shapeComp]);
            const renComp = new RenderComponent(entityID, 'white', 'blue', GameScene.GROUND_LAYER);
            const componentsDict = {};
            componentsDict[ShapeComponent] = shapeComp;
            componentsDict[RenderComponent] = renComp;
            componentsDict[PhysicsComponent] = phyComp;

            this.platformIDs.push(entityID);
    
            this.addEntity(entityID, componentsDict);
        }

    }

    createPlayer() {

        const groups = ShapeComponent.GROUPS,
              masks = ShapeComponent.MASKS;

        let entityID = Entity.GENERATE_ID();
        this.playerID = entityID;

        const shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: 30, height: 30}, [0,0], [0,0], 0, 
            groups.PLAYER, masks.PLAYER, GameScene.CHARACTER_MATERIAL)
            const phyComp = new PhysicsComponent(entityID, {
            mass: 100, 
            position: [canvas.width/2, canvas.height/2],
            fixedRotation: true,
            gravityScale: 2
        }, [shapeComp]);
        const healthComp = new HealthComponent(entityID, 1, Callbacks.DELETE_ENTITY);
        const jumpComp = new JumpComponent(entityID, [60, 60, 60]);

        const renComp = new RenderComponent(entityID, 'blue', 'blue', GameScene.PLAYER_LAYER);
        
        let callbackComponent = new LoopCallbackComponent(entityID, ((phyComp) => (componentsDict, dt) => {

            let dx = 0, dy = 0;
            if (InputManager.fromChar('a').down) {
                dx = -25;
            } else if (InputManager.fromChar('d').down) {
                dx = 25;
            }

            phyComp.body.velocity[0] = dx;

            if (dy) {
                phyComp.body.velocity[1] = dy;
            }

        })(phyComp));
        
        let componentsDict = {};
        componentsDict[RenderComponent] = renComp;
        componentsDict[ShapeComponent] = shapeComp;
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
        this.addDeletionCallback(this.playerID, () => {
            InputManager.removeListener('keydown', jumpListener);
        })

        // add gun
        entityID = Entity.GENERATE_ID();
        componentsDict = WeaponFactory.createPistol(entityID, this.playerID);

        callbackComponent = new LoopCallbackComponent(entityID, (dt, components) => {
            const mousePos = [InputManager.mouse.x, InputManager.mouse.y];
            const gunPos = componentsDict[TransformComponent].position;
            const vec = [mousePos[0] - gunPos[0], mousePos[1] - gunPos[1]];
            componentsDict[TransformComponent].angle = Math.atan2(vec[1], vec[0]);
        });
        componentsDict[LoopCallbackComponent] = [callbackComponent];
        
        this.addEntity(entityID, componentsDict);

        const fireListener = (mouse, event) => {
            this.addEvent(new TransmittedEvent(null, entityID, ProjectileWeaponSystem, ProjectileWeaponSystem.FIRE_WEAPON_EVENT, {}));
        }
        InputManager.addListener('mousedown', fireListener);
        //InputManager.addListener('mouseup', fireListener);
        const gunID = entityID;
        this.addDeletionCallback(gunID, (id, scene) => {
            InputManager.removeListener('mousedown', fireListener);
            InputManager.removeListener('mouseup', fireListener);
        });
        

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
    new GameScene.SpawnRotation([reg, reg, reg], [500, 500, 3500]),
    new GameScene.SpawnRotation([big], [2500]),
    new GameScene.SpawnRotation([reg, big, reg], [500, 500, 5000]),
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