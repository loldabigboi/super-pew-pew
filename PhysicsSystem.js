class PhysicsSystem extends System {

    constructor() {
        
        super();
        
        this.world = new p2.World({
            gravity: [0, -9.82]
        });

        this.addComponentCallback = (component) => {
            this.world.addBody(component.body);
        }

    }

    update(dt) {

        const fixedTimeStep = 1 / 60;
        const maxSubSteps = 10;

        this.world.step(fixedTimeStep, dt, maxSubSteps);

    }

}