class GameScene extends Scene {

    constructor() {

        super();

        const canvas = document.getElementsByTagName("canvas")[0];
        canvas.width = 800;
        canvas.height = 600;

        const physicsSystem = new PhysicsSystem();
        const loopSystem = new LoopCallbackSystem();
        const projectileSystem = new ProjectileWeaponSystem();
        const trackingSystem = new TrackingSystem();
        const renderSystem = new RenderSystem();

        this.addSystem(loopSystem, 0);
        this.addSystem(physicsSystem, 1);
        this.addSystem(trackingSystem, 2);
        this.addSystem(projectileSystem, 2);
        this.addSystem(renderSystem, 3);

        const obstacleMaterial = new p2.Material();
        physicsSystem.world.addContactMaterial(new p2.ContactMaterial(BulletWeaponComponent.MATERIAL, obstacleMaterial, {
            restitution : 1.0,
            friction: 0,
            stiffness : Number.MAX_VALUE // We need infinite stiffness to get exact restitution
        }));

        let entityID, shapeComp, phyComp, renComp, componentsDict;

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
            entityID = Entity.GENERATE_ID();
            shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {
                width: widthArray[i],
                height: 20
            }, [0,0], [0,0], 0, obstacleMaterial)
            phyComp = new PhysicsComponent(entityID,  {
                mass: 0, 
                position: positionArray[i],
            }, [shapeComp]);
            renComp = new RenderComponent(entityID, 0, 0, null, null, 'white', 'blue');
            componentsDict = {};
            componentsDict[ShapeComponent] = shapeComp;
            componentsDict[RenderComponent] = renComp;
            componentsDict[PhysicsComponent] = phyComp;
    
            this.addEntity(entityID, componentsDict);
        }
        

        // add planes to contain area
        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.PLANE, {}, [0,0], [0,0], 0, obstacleMaterial)
        phyComp = new PhysicsComponent(entityID, {}, [shapeComp]);

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        this.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.PLANE, {}, [0,0], [0,0], 0, obstacleMaterial)
        phyComp = new PhysicsComponent(entityID, {angle: Math.PI/2, position: [canvas.width, 0]}, [shapeComp]);

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        this.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.PLANE, {}, [0,0], [0,0], 0, obstacleMaterial)
        phyComp = new PhysicsComponent(entityID, {angle: Math.PI, position: [0, canvas.height]}, [shapeComp]);

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        this.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.PLANE, {}, [0,0], [0,0], 0, obstacleMaterial)
        phyComp = new PhysicsComponent(entityID, {angle: -Math.PI/2, position: [0, 0]}, [shapeComp]);

        componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        this.addEntity(entityID, componentsDict);

        // add player
        entityID = Entity.GENERATE_ID();
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: 20, height: 40}, [0,0], [0,0], 0)
        phyComp = new PhysicsComponent(entityID, {
            mass: 100, 
            position: [canvas.width/2, canvas.height/2],
            fixedRotation: true,
            velocity: [50, 0]
        }, [shapeComp]);

        renComp = new RenderComponent(entityID, 0, 0, null, null, 'pink', 'purple');
        
        let callbackComponent = new LoopCallbackComponent(entityID, (componentsDict, dt) => {

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

        });
        
        componentsDict = {};
        componentsDict[RenderComponent] = renComp;
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;
        componentsDict[LoopCallbackComponent] = [callbackComponent];

        this.addEntity(entityID, componentsDict);

        // add gun
        const playerID = entityID;
        entityID = Entity.GENERATE_ID();
        renComp = new RenderComponent(entityID, 0, 0, null, null, 'red', 'red');
        shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: 20, height: 5}, [0, 0], ShapeComponent.CENTER_LEFT, 0);
        let transComp = new TransformComponent(entityID, [0, 0], 0);
        let trackComp = new TrackingComponent(entityID, playerID, ShapeComponent.CENTER, [0, 3], 1);
        let wepComps = BulletWeaponComponent.PISTOL(entityID);
        callbackComponent = new LoopCallbackComponent(entityID, (components, dt) => {

            const mousePos = [InputManager.mouse.x, InputManager.mouse.y];
            const gunPos = transComp.pos;
            const vec = [mousePos[0] - gunPos[0], mousePos[1] - gunPos[1]];
            transComp.angle = Math.atan2(vec[1], vec[0]);

        });

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