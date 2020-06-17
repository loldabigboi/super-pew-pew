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
        const renderSystem = new RenderSystem();

        this.currScene.addSystem(physicsSystem, 0);
        this.currScene.addSystem(renderSystem, 1);

        let entityID, phyComp, renComp, componentsDict;
        for (let i = 0; i < 50; i++) {
            entityID = Entity.GENERATE_ID();
            phyComp = new PhysicsComponent(entityID, {
                mass: 1, 
                position: [canvas.width/2, canvas.height/2],
                angle: Math.PI / 9,
                velocity: [50, 0]
            }, p2.Shape.BOX,
            {
                width: 20,
                height: 40
            });

            renComp = new RenderComponent(entityID, 0, 0, null, null, 'red', 'black');
            componentsDict = {};
            componentsDict[RenderComponent] = renComp;
            componentsDict[PhysicsComponent] = phyComp;

            this.currScene.addEntity(entityID, componentsDict);
        }

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
