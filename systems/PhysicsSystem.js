
class PhysicsSystem extends System {

    constructor() {
        
        super([PhysicsComponent]);
        
        this.world = new p2.World({
            gravity: [0, 9.82]
        });

    }

    receiveEvent(event) {

        if (event.type === PhysicsSystem.ADD_LISTENER_EVENT) {
            this.world.on(event.obj.type, event.obj.listener);
        }

    }

    addEntity(id, components) {

        if (super.addEntity(id, components)) {
            this.world.addBody(components[PhysicsComponent].body);
        }
        
    }

    deleteEntity(id) {
        this.world.removeBody(this.entities[id][PhysicsComponent].body);
        super.deleteEntity(id);
    }

    update(dt) {

        const fixedTimeStep = 1 / 60;
        const maxSubSteps = 10;

        this.world.step(fixedTimeStep, dt, maxSubSteps);

    }

}

PhysicsSystem.ADD_LISTENER_EVENT = "add_listener";
    
