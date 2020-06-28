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

    deleteEntity(id) {
        super.deleteEntity(id);
        this.jumpRequests = this.jumpRequests.filter((evt) => evt.recipientID != id);
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
                this.entities[jumpBody.id][JumpComponent].remainingBoost = this.entities[jumpBody.id][JumpComponent].totalBoost;
            }

        }

        
        for (const jumpRequest of this.jumpRequests) {

            const id = jumpRequest.recipientID;
            const c = this.entities[id];
            const jumpC = c[JumpComponent];
            const physC = c[PhysicsComponent];

            if (jumpC.canJump) {
                physC.body.velocity[1] = -jumpC.initialStrength;
                jumpC.canJump = false;
            } else {
                let boost;
                if (jumpC.remainingBoost < jumpC.boostRate) {
                    boost = jumpC.remainingBoost;
                    jumpC.remainingBoost = 0;
                } else {
                    boost = jumpC.boostRate;
                    jumpC.remainingBoost -= jumpC.boostRate;
                }
                physC.body.velocity[1] -= boost;
            }

        }

        this.jumpRequests = [];

    }

    
    
}

JumpSystem.JUMP_REQUEST = "jump_request";