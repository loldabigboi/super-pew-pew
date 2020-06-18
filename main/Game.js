class Game {

    constructor() {
        this.scenes = {

        }
        this.currScene = new Scene();

        // hard-coded test

        const canvas = document.getElementsByTagName("canvas")[0];
        canvas.width = 800;
        canvas.height = 600;

        const physicsSystem = new PhysicsSystem();
        const loopSystem = new LoopCallbackSystem();
        const trackingSystem = new TrackingSystem();
        const renderSystem = new RenderSystem();

        this.currScene.addSystem(loopSystem, 0);
        this.currScene.addSystem(physicsSystem, 1);
        this.currScene.addSystem(trackingSystem, 2);
        this.currScene.addSystem(renderSystem, 3);

        let entityID, phyComp, renComp, componentsDict;
        for (let i = 0; i < 50; i++) {  //  add obstacles
            entityID = Entity.GENERATE_ID();
            phyComp = new PhysicsComponent(entityID, {
                mass: 1, 
                position: [Math.random()*canvas.width, Math.random()*canvas.height/2],
                angle: Math.random()*Math.PI*2,
                velocity: [Math.random()*50, Math.random()*50]
            }, p2.Shape.BOX,
            {
                width: 20,
                height: 40
            });

            renComp = new RenderComponent(entityID, 0, 0, null, null, 'white', 'blue');
            componentsDict = {};
            componentsDict[RenderComponent] = renComp;
            componentsDict[PhysicsComponent] = phyComp;

            this.currScene.addEntity(entityID, componentsDict);
        }

        // add planes to contain area
        entityID = Entity.GENERATE_ID();
        phyComp = new PhysicsComponent(entityID, {}, p2.Shape.PLANE, {});

        componentsDict = {}
        componentsDict[PhysicsComponent] = phyComp;
        console.log(phyComp);
        this.currScene.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        phyComp = new PhysicsComponent(entityID, {angle: Math.PI/2, position: [canvas.width, 0]}, p2.Shape.PLANE, {});

        componentsDict = {}
        componentsDict[PhysicsComponent] = phyComp;
        console.log(phyComp);
        this.currScene.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        phyComp = new PhysicsComponent(entityID, {angle: Math.PI, position: [0, canvas.height]}, p2.Shape.PLANE, {});

        componentsDict = {}
        componentsDict[PhysicsComponent] = phyComp;
        console.log(phyComp);
        this.currScene.addEntity(entityID, componentsDict);

        entityID = Entity.GENERATE_ID();
        phyComp = new PhysicsComponent(entityID, {angle: -Math.PI/2, position: [0, canvas.height]}, p2.Shape.PLANE, {});

        componentsDict = {}
        componentsDict[PhysicsComponent] = phyComp;
        console.log(phyComp);
        this.currScene.addEntity(entityID, componentsDict);

        // add player
        entityID = Entity.GENERATE_ID();
        phyComp = new PhysicsComponent(entityID, {
            mass: 100, 
            position: [canvas.width/2, canvas.height/2],
            fixedRotation: true,
            velocity: [50, 0]
        }, p2.Shape.BOX,
        {
            width: 20,
            height: 40
        });

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
        componentsDict[PhysicsComponent] = phyComp;
        componentsDict[LoopCallbackComponent] = [callbackComponent];

        this.currScene.addEntity(entityID, componentsDict);

        // add gun
        const playerID = entityID;
        entityID = Entity.GENERATE_ID();
        renComp = new RenderComponent(entityID, 0, 0, null, null, 'red', 'red');
        let transComp = new TransformComponent(entityID, [0, 0], TransformComponent.CENTER_LEFT, 25, 5, 0);
        let trackComp = new TrackingComponent(entityID, playerID, TransformComponent.CENTER, [0, 0], 1);
        callbackComponent = new LoopCallbackComponent(entityID, (components, dt) => {

            const mousePos = [InputManager.mouse.x, InputManager.mouse.y];
            const gunPos = transComp.pos;

        });

        componentsDict = {};
        componentsDict[RenderComponent] = renComp;
        componentsDict[TransformComponent] = transComp;
        componentsDict[TrackingComponent] = trackComp;

        this.currScene.addEntity(entityID, componentsDict);

    }

    run(last) {

        let now = Date.now();
        let dt = (now - last) / 100;
        this.currScene.update(dt);

        const thisRef = this;
        window.requestAnimationFrame(() => {
            thisRef.run(now);
        })
        
    }

}
