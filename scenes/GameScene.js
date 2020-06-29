class GameScene extends Scene {

    constructor(game) {

        super(game);

        const physicsSystem = new PhysicsSystem();

        this.addSystem(physicsSystem, 1);
        this.addSystem(new BasicEnemyAISystem(physicsSystem.world), 1);
        this.addSystem(new FlyingEnemyAISystem(), 1);
        this.addSystem(new ProjectileWeaponSystem(), 2);
        this.addSystem(new MouseInteractableSystem(), 2);
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
        this.createUI();

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
            if (key.code === InputManager.ESC) {
                this.game.changeScene(new MainMenuScene(this.game));
            }
        });

        this.gameMouseUiC[MouseInteractableComponent].listeners.mousedown.push(() => {
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
            c[RenderComponent].fill = 'rgb(200,0,0)';
        } else if (type == GameScene.EnemyTypes.FLYING) {
            c = BasicEnemyFactory.createEnemy(entityID, [canvas.width/2, 0], 15*this.spawnDir, 30, 2, 0.2);
            c[RenderComponent].fill = 'pink';
            c[ShapeComponent].shape.material = ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL;
            c[FlyingEnemyAIComponent] = new FlyingEnemyAIComponent(entityID, this.playerID, 25);
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

        if (InputManager.fromChar('w').down) {
            this.addEvent(new TransmittedEvent(this.playerID, this.playerID, JumpSystem, JumpSystem.JUMP_REQUEST));
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

    createUI() {

        const canvas = document.getElementsByTagName('canvas')[0];

        this.scoreTextID = Entity.GENERATE_ID();
        this.scoreTextC = {};
        this.scoreTextC[TransformComponent] = new TransformComponent(this.scoreTextID, [canvas.width/2, 50], 0);
        this.scoreTextC[TextRenderComponent] = new TextRenderComponent(this.scoreTextID, '0', {fontFamily: 'cursive', fontSize: 56});
        this.scoreTextC[RenderComponent] = new RenderComponent(this.scoreTextID, 'white', 'black', 2, GameScene.GAME_OVERLAY_LAYER, true);
        this.scoreTextC[LoopCallbackComponent] = [];
        this.addEntity(this.scoreTextID, this.scoreTextC);

        this.gameMouseUiID = Entity.GENERATE_ID();
        this.gameMouseUiC = {};
        this.gameMouseUiC[TransformComponent] = new TransformComponent(this.gameMouseUiID, [canvas.width/2, canvas.height/2], 0);
        this.gameMouseUiC[ShapeComponent] = new ShapeComponent(this.gameMouseUiID, p2.Shape.BOX, {width: canvas.width, height: canvas.height}, [0,0], [0,0], 0);
        this.gameMouseUiC[MouseInteractableComponent] = new MouseInteractableComponent(this.gameMouseUiID, {}, GameScene.GAME_OVERLAY_LAYER);
        
        this.addEntity(this.gameMouseUiID, this.gameMouseUiC);

        this.scorePopupID = Entity.GENERATE_ID();
        this.scorePopupC = {};
        this.scorePopupC[MouseInteractableComponent] = new MouseInteractableComponent(this.scorePopupID, {}, GameScene.OVERLAY_LAYER);
        this.scorePopupC[MouseInteractableComponent].interactable = false;
        this.scorePopupC[ShapeComponent] = new ShapeComponent(this.scorePopupID, p2.Shape.BOX,
            {width: canvas.width, height: canvas.height}, [0,0], [0,0], 0);
        this.scorePopupC[TransformComponent] = new TransformComponent(this.scorePopupID, [canvas.width/2, canvas.height/2], 0);
        this.scorePopupC[RenderComponent] = new RenderComponent(this.scorePopupID, 'rgba(255,255,255,0.5)', undefined, undefined, GameScene.OVERLAY_LAYER, true);
        this.scorePopupC[RenderComponent].render = false;

        this.addEntity(this.scorePopupID, this.scorePopupC);

        this.scorePopupTextID = Entity.GENERATE_ID();
        this.scorePopupTextC = {};
        this.scorePopupTextC[RenderComponent] = new RenderComponent(this.scorePopupTextID, 'white', 'black', 2, GameScene.OVERLAY_LAYER, 'inherit');
        this.scorePopupTextC[RenderComponent].render = 'inherit'
        this.scorePopupTextC[TextRenderComponent] = new TextRenderComponent(this.scorePopupTextID, 'you died with 0 points lole :p', {
            fontSize: 54,
            fontFamily: 'cursive'
        });
        this.scorePopupTextC[ParentComponent] = new ParentComponent(this.scorePopupTextID, this.scorePopupID, [0, 0], [0,0], Callbacks.DELETE_ENTITY);
        this.scorePopupTextC[TransformComponent] = new TransformComponent(this.scorePopupTextID, [0, -100], 0);

        this.addEntity(this.scorePopupTextID, this.scorePopupTextC);

        const playAgainID = Entity.GENERATE_ID();
        const playAgainC = ButtonFactory.createSimpleButton(playAgainID, GameScene.OVERLAY_LAYER, {fill: 'red'}, {fill: 'blue'}, {fill: 'lightgreen'});
        playAgainC[MouseInteractableComponent].listeners.mouseup.push(() => {
            
            this.createPlayer();
            this.equipNextWeapon();

            for (let entityID of Object.keys(this.entities)) {
                if (this.entities[entityID][BasicEnemyAIComponent]) {
                    this.addEvent(new TransmittedEvent(null, entityID, null, Scene.DELETE_ENTITY_EVENT, {}));
                }
            }

            this.score = 0;
            this.scoreTextC[TextRenderComponent].text = '0';
            this.scorePopupC[RenderComponent].render = false;
            this.scorePopupC[MouseInteractableComponent].interactable = false;
        
        });
        playAgainC[MouseInteractableComponent].interactable = 'inherit';
        playAgainC[RenderComponent].isStatic = 'inherit';
        playAgainC[RenderComponent].render = 'inherit';
        playAgainC[ShapeComponent] = new ShapeComponent(playAgainID, p2.Shape.BOX, {width: 150, height: 50}, [0,0], [0,0], 0);
        playAgainC[ParentComponent] = new ParentComponent(playAgainID, this.scorePopupID, [0, 0], [0,0], Callbacks.DELETE_ENTITY);
        playAgainC[TransformComponent] = new TransformComponent(playAgainID, [0, 100], 0);

        this.addEntity(playAgainID, playAgainC);

        const playAgainTextID = Entity.GENERATE_ID();
        const playAgainTextC = {};
        playAgainTextC[RenderComponent] = new RenderComponent(playAgainTextID, 'white', undefined, 1, GameScene.OVERLAY_LAYER, 'inherit');
        playAgainTextC[RenderComponent].render = 'inherit'
        playAgainTextC[TextRenderComponent] = new TextRenderComponent(playAgainTextID, 'play agen', {fontSize: 28, fontFamily: 'cursive'});
        playAgainTextC[ParentComponent] = new ParentComponent(playAgainTextID, playAgainID, [0, 0], [0,0], Callbacks.DELETE_ENTITY);
        playAgainTextC[TransformComponent] = new TransformComponent(playAgainID, [0, 0], 0);

        this.addEntity(playAgainTextID, playAgainTextC);

        const quitID = Entity.GENERATE_ID();
        const quitC = ButtonFactory.createSimpleButton(quitID, GameScene.OVERLAY_LAYER, {fill: 'red'}, {fill: 'blue'}, {fill: 'lightgreen'});
        quitC[MouseInteractableComponent].listeners.mouseup.push(() => {      
            this.game.changeScene(new MainMenuScene(this.game));
        });
        quitC[MouseInteractableComponent].interactable = 'inherit';
        quitC[RenderComponent].isStatic = 'inherit';
        quitC[RenderComponent].render = 'inherit';
        quitC[ShapeComponent] = new ShapeComponent(quitID, p2.Shape.BOX, {width: 80, height: 50}, [0,0], [0,0], 0);
        quitC[ParentComponent] = new ParentComponent(quitID, this.scorePopupID, [0, 0], [0,0], Callbacks.DELETE_ENTITY);
        quitC[TransformComponent] = new TransformComponent(quitID, [0, 175], 0);

        this.addEntity(quitID, quitC);

        const quitTextID = Entity.GENERATE_ID();
        const quitTextC = {};
        quitTextC[RenderComponent] = new RenderComponent(quitTextID, 'white', undefined, 1, GameScene.OVERLAY_LAYER, 'inherit');
        quitTextC[RenderComponent].render = 'inherit'
        quitTextC[TextRenderComponent] = new TextRenderComponent(quitTextID, 'quit', {fontSize: 28, fontFamily: 'cursive'});
        quitTextC[ParentComponent] = new ParentComponent(quitTextID, quitID, [0, 0], [0,0], Callbacks.DELETE_ENTITY);
        quitTextC[TransformComponent] = new TransformComponent(quitTextID, [0, 0], 0);

        this.addEntity(quitTextID, quitTextC);

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

        this.score++;
        this.scoreTextC[TextRenderComponent].text = ''+this.score;

        const sizeCallback = CallbackFactory.createFnAttributeModifier((x) => Math.pow(2, (-(x*x))), this.scoreTextC[TextRenderComponent], 
        ['fontSize'], 25, 0.25, -1.7);
        const rotCallback = CallbackFactory.createFnAttributeModifier(Math.sin, this.scoreTextC[TransformComponent], 
        ['angle'], 0.08, 0.55, -Math.PI);
        this.scoreTextC[LoopCallbackComponent].push(
            new LoopCallbackComponent(this.scoreTextID, CallbackFactory.attachSelfDestructThreshold(sizeCallback, 
                this.scoreTextC[LoopCallbackComponent], 'x', 2))
        );
        this.scoreTextC[LoopCallbackComponent].push(
            new LoopCallbackComponent(this.scoreTextID, CallbackFactory.attachSelfDestructThreshold(rotCallback, 
                this.scoreTextC[LoopCallbackComponent], 'x', Math.PI))
        );
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
        const healthComp = new HealthComponent(entityID, 1, (obj) => {
            Callbacks.DELETE_ENTITY(obj);
            this.scorePopupC[RenderComponent].render = true;
            this.scorePopupC[MouseInteractableComponent].interactable = true;
            const txt = 'you died with ' + this.score + ' point' + (this.score != 1 ? 's' : '') + ' lole :p';
            this.scorePopupTextC[TextRenderComponent].text = txt;
        });
        const jumpComp = new JumpComponent(entityID, 75, 50, 5);
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
        
    }

    equipNextWeapon() {

        if (this.currWeapon) {
            const currID = this.currWeapon[WeaponComponent].entityID;
            this.addEvent(new TransmittedEvent(null, currID, null, Scene.DELETE_ENTITY_EVENT, {}));
        }

        this.currWeapon = this.nextWeapon;
        const entityID = this.currWeapon[WeaponComponent].entityID;
        this.currWeapon[LoopCallbackComponent] = [new LoopCallbackComponent(entityID, (dt, components) => {
            const ui = this.gameMouseUiC[MouseInteractableComponent];
            const mousePos = [ui.mouse.x, ui.mouse.y];
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
    BIG: 1,
    FLYING: 2
}

const reg = GameScene.EnemyTypes.REGULAR,
      big = GameScene.EnemyTypes.BIG,
      fly = GameScene.EnemyTypes.FLYING;
GameScene.SpawnRotations = [
    new GameScene.SpawnRotation([reg], [1000]),
    new GameScene.SpawnRotation([reg, reg, reg], [300, 300, 3500]),
    new GameScene.SpawnRotation([big], [2500]),
    new GameScene.SpawnRotation([reg, big, reg], [300, 300, 5000]),
    new GameScene.SpawnRotation([big, big], [1000, 5000]),
    new GameScene.SpawnRotation([fly], [250]),
    new GameScene.SpawnRotation([fly, fly], [200, 400]),
    new GameScene.SpawnRotation([reg, fly, reg], [300, 300, 800])
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
GameScene.GAME_OVERLAY_LAYER = 6;
GameScene.OVERLAY_LAYER = 7;