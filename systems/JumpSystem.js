class JumpSystem extends System {

    constructor(world) {

        super([JumpComponent, PhysicsComponent]);
        this.jumpRequests = [];
        this.world = world;

    }

    receiveEvent(event) {
        if (event.type === JumpSystem.JUMP_REQUEST) {
            this.jumpRequests.push(event);
        }
    }

    update(dt, entities) {

        for(let i = 0; i < this.world.narrowphase.contactEquations.length; i++){
            
            const c = this.world.narrowphase.contactEquations[i];

            let jumpBody, otherBody;
            if (this.entities[c.bodyA.id]) {
                jumpBody = c.bodyA;
                otherBody = c.bodyB;
            } else if (this.entities[c.bodyB.id]) {
                jumpBody = c.bodyB;
                otherBody = c.bodyA;
            } else {
                continue;
            }

            if ((jumpBody == c.bodyA && c.normalA[1] == 1) || 
                (jumpBody == c.bodyB && c.normalA[1] == -1)) {
                this.entities[jumpBody.id][JumpComponent].canJump = true;
                this.entities[jumpBody.id][JumpComponent].jumpI = 0;
            }

        }

        
        for (const jumpRequest of this.jumpRequests) {

            const id = jumpRequest.recipientID;
            const c = this.entities[id];
            const jumpC = c[JumpComponent];
            const physC = c[PhysicsComponent];

            if (jumpC.canJump) {

                physC.body.velocity[1] = -jumpC.strengthArray[jumpC.jumpI];
                jumpC.jumpI++;
                jumpC.canJump = jumpC.jumpI < jumpC.strengthArray.length;

            }

        }

        this.jumpRequests = [];

    }

    
    
}

JumpSystem.JUMP_REQUEST = "jump_request";