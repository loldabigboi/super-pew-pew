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

        const cantJumpIds = Object.keys(this.entities);
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
            
            const jumpComp = this.entities[jumpBody.id][JumpComponent];
            if ((jumpBody == c.bodyA && c.normalA[1] == 1) || 
                (jumpBody == c.bodyB && c.normalA[1] == -1)) {
                cantJumpIds.splice(cantJumpIds.indexOf(jumpBody.id), 1);
                jumpComp.didJump = false;
                jumpComp.canJump = true;
                jumpComp.remainingBoost = this.entities[jumpBody.id][JumpComponent].totalBoost;
            } else if ((jumpBody == c.bodyA && c.normalA[1] == -1) || 
                       (jumpBody == c.bodyB && c.normalA[1] == 1)) {
                jumpComp.remainingBoost = 0;
            }

        }

        cantJumpIds.forEach((id) => this.entities[id][JumpComponent].canJump = false);

        
        for (const jumpRequest of this.jumpRequests) {

            const id = jumpRequest.recipientID;
            const c = this.entities[id];
            const jumpC = c[JumpComponent];
            const physC = c[PhysicsComponent];

            if (jumpC.canJump) {
                physC.body.velocity[1] = -jumpC.initialStrength;
                jumpC.didJump = true;
                jumpC.canJump = false;
            } else if (jumpC.didJump) {
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