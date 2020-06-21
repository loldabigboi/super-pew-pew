class GameScene extends Scene {

    constructor() {

        super();

        const canvas = document.getElementsByTagName("canvas")[0];
        canvas.width = 800;
        canvas.height = 600;

        const physicsSystem = new PhysicsSystem();
        const loopSystem = new LoopCallbackSystem();
        const enemyAISystem = new BasicEnemyAISystem(this);
        const projectileSystem = new ProjectileWeaponSystem();
        const trackingSystem = new TrackingSystem();
        const renderSystem = new RenderSystem();

        this.addSystem(loopSystem, 0);
        this.addSystem(physicsSystem, 1);
        this.addSystem(enemyAISystem, 1);
        this.addSystem(trackingSystem, 2);
        this.addSystem(projectileSystem, 2);
        this.addSystem(renderSystem, 3);

        physicsSystem.world.addContactMaterial(new p2.ContactMaterial(BulletWeaponComponent.MATERIAL, GameScene.OBSTACLE_MATERIAL, {
            restitution : 1.0,
            friction: 0,
            stiffness : Number.MAX_VALUE // We need infinite stiffness to get exact restitution
        }));
        physicsSystem.world.addContactMaterial(new p2.ContactMaterial(GameScene.CHARACTER_MATERIAL, GameScene.OBSTACLE_MATERIAL, {
            restitution : 0,
            friction: 0,
            relaxation: 10,  //  get rid of residual bouncing effect
            stiffness : Number.MAX_VALUE // We need infinite stiffness to get exact restitution
        }));
        physicsSystem.world.addContactMaterial(new p2.ContactMaterial(GameScene.CHARACTER_MATERIAL, GameScene.CHARACTER_MATERIAL, {
            restitution : 0,
            friction: 0,
            relaxation: 10, //  get rid of residual bouncing effect
            stiffness: Number.MAX_VALUE // We need infinite stiffness to get exact restitution
        }));

        this.createBorders();
        this.createPlatforms();
        this.createPlayer();

        // add enemy
        this.addEntity(BasicEnemyFactory.createEnemy(25, 40, 1, GameScene.CHARACTER_MATERIAL));

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
        let renComp = new RenderComponent(entityID, 'white', 'blue');

        let componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[RenderComponent] = renComp;
        componentsDict[PhysicsComponent] = phyComp;
        this.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, GameScene.OBSTACLE_MATERIAL)
        phyComp = new PhysicsComponent(entityID, {position: [canvas.width - w/2, h/2]}, [shapeComp]);
        renComp = new RenderComponent(entityID, 'white', 'blue');

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
        renComp = new RenderComponent(entityID, 'white', 'blue');

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        componentsDict[RenderComponent] = renComp;
        this.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, GameScene.OBSTACLE_MATERIAL)
         phyComp = new PhysicsComponent(entityID, {position: [canvas.width - w/2+1, h/2-1]}, [shapeComp]);
        renComp = new RenderComponent(entityID, 'white', 'blue');

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        componentsDict[RenderComponent] = renComp;
        this.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, GameScene.OBSTACLE_MATERIAL)
        phyComp = new PhysicsComponent(entityID, {position: [w/2-1, canvas.height - h/2+1]}, [shapeComp]);
        renComp = new RenderComponent(entityID, 'white', 'blue');

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        componentsDict[RenderComponent] = renComp;
        this.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, GameScene.OBSTACLE_MATERIAL)
        phyComp = new PhysicsComponent(entityID, {position: [canvas.width - w/2+1, canvas.height - h/2+1]}, [shapeComp]);
        renComp = new RenderComponent(entityID, 'white', 'blue');

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        componentsDict[RenderComponent] = renComp;
        this.addEntity(entityID, componentsDict);


    }

    createPlatforms() {

        const canvas = document.getElementsByTagName("canvas")[0];

        const groups = ShapeComponent.GROUPS,
              masks = ShapeComponent.MASKS;

        const positionArray = [
            [400, canvas.height-125],
            [124, 325],
            [canvas.width-124, 325],
            [400, 175]
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
            const renComp = new RenderComponent(entityID, 'white', 'blue');
            const componentsDict = {};
            componentsDict[ShapeComponent] = shapeComp;
            componentsDict[RenderComponent] = renComp;
            componentsDict[PhysicsComponent] = phyComp;
    
            this.addEntity(entityID, componentsDict);
        }

    }

    createPlayer() {

        const groups = ShapeComponent.GROUPS,
              masks = ShapeComponent.MASKS;

        let entityID = Entity.GENERATE_ID();
        this.playerID = entityID;

        let shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: 20, height: 40}, [0,0], [0,0], 0, 
            groups.PLAYER, masks.PLAYER, GameScene.CHARACTER_MATERIAL)
        let phyComp = new PhysicsComponent(entityID, {
            mass: 100, 
            position: [canvas.width/2, canvas.height/2],
            fixedRotation: true,
            velocity: [50, 0]
        }, [shapeComp]);

        let renComp = new RenderComponent(entityID, 'pink', 'purple');
        
        let callbackComponent = new LoopCallbackComponent(entityID, ((phyComp) => (componentsDict, dt) => {

            let dx = 0, dy = 0;
            if (InputManager.fromChar('a').down) {
                dx = -25;
            } else if (InputManager.fromChar('d').down) {
                dx = 25;
            }

            if (InputManager.fromChar('w').down) {
                dy = -25;
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
        componentsDict[LoopCallbackComponent] = [callbackComponent];

        this.addEntity(entityID, componentsDict);

        // add entity to track player for impact event detection with enemies
        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: shapeComp.shape.width, height: shapeComp.shape.height}, 
            [0,0], [0,0], 0, groups.PLAYER, masks.PLAYER_IMPACT);
        phyComp = new PhysicsComponent(entityID, {collisionResponse: false}, [shapeComp]);
        //renComp = new RenderComponent(entityID, 'blue', 'blue');
        let trackComp = new TrackingComponent(entityID, this.playerID, ShapeComponent.CENTER, [0, 0], 1);
        
        componentsDict = {};
        componentsDict[RenderComponent] = renComp;
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        componentsDict[TrackingComponent] = trackComp;

        this.addEntity(entityID, componentsDict);

        // add gun
        entityID = Entity.GENERATE_ID();
        renComp = new RenderComponent(entityID, 'red', 'red');
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: 20, height: 5}, [0, 0], ShapeComponent.CENTER_LEFT, 0);
        let transComp = new TransformComponent(entityID, [0, 0], 0);
        trackComp = new TrackingComponent(entityID, this.playerID, ShapeComponent.CENTER, [0, 3], 1);
        let wepComps = BulletWeaponComponent.PISTOL(entityID);
        callbackComponent = new LoopCallbackComponent(entityID, ((transComp) => (dt, components) => {
            const mousePos = [InputManager.mouse.x, InputManager.mouse.y];
            const gunPos = transComp.position;
            const vec = [mousePos[0] - gunPos[0], mousePos[1] - gunPos[1]];
            transComp.angle = Math.atan2(vec[1], vec[0]);
        })(transComp));

        InputManager.addListener('click', InputManager.GENERATE_ID(), (mouse, event) => {
            this.addEvent(new TransmittedEvent(null, entityID, ProjectileWeaponSystem, ProjectileWeaponSystem.FIRE_WEAPON_EVENT, {}));
        });

        componentsDict = {};
        componentsDict[RenderComponent] = renComp;
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[TransformComponent] = transComp;
        componentsDict[TrackingComponent] = trackComp;
        componentsDict[LoopCallbackComponent] = [callbackComponent];
        componentsDict = {...componentsDict, ...wepComps};

        this.addEntity(entityID, componentsDict);

    }

}

GameScene.CHARACTER_MATERIAL = new p2.Material();
GameScene.OBSTACLE_MATERIAL = new p2.Material();