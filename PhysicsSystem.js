class PhysicsSystem extends System {

    constructor() {
        
        super(PhysicsComponent);
        
        this.world = new p2.World({
            gravity: [0, -9.82]
        });

    }

    addEntity(id, components) {

        super(id, components);
        this.world.addBody(components[PhysicsComponent].body);
        
    }

    update(dt) {

        const fixedTimeStep = 1 / 60;
        const maxSubSteps = 10;

        this.world.step(fixedTimeStep, dt, maxSubSteps);

    }

}