class BasicEnemyAISystem extends System {

    constructor(world) {
        super([BasicEnemyAIComponent, PhysicsComponent]);
        this.lastVel = {};  // stores the last x velocity of the enemy body
        this.wasColliding = {};  // stores whether the enemy was colliding with a wall the previous update
        world.on('impact', (evt) => {
            const bodyA = evt.bodyA,
                    bodyB = evt.bodyB;

            let enemyBody, otherBody;
            if (this.lastVel[bodyA.id]) {
                enemyBody = bodyA;
                otherBody = bodyB;
            } else if (this.lastVel[bodyB.id]) {
                enemyBody = bodyB;
                otherBody = bodyA;
            } else {
                return;  // nothing to be done
            }

            if (otherBody.shapes[0].collisionGroup === ShapeComponent.GROUPS.GROUND && !this.wasColliding[enemyBody.id]) {
                const contactEq = evt.contactEquation;
                if (contactEq.normalA[0] == -1 || contactEq.normalA[0] == 1) {
                    this.wasColliding[enemyBody.id] = true;
                    // reset speed to initial speed but reverse direction
                    const c = this.entities[enemyBody.id];
                    enemyBody.velocity[0] = -Math.sign(this.lastVel[enemyBody.id])*this.entities[enemyBody.id][BasicEnemyAIComponent].speed;
                }

            }
        });
    }

    addEntity(id, components) {

        if (super.addEntity(id, components)) {
            this.lastVel[id] = components[PhysicsComponent].body.velocity[0];
        }

    }

    deleteEntity(id) {

        super.deleteEntity(id);
        delete this.lastVel[id];
        delete this.wasColliding[id];

    }

    update(dt, entities) {

        for (const id of Object.keys(this.entities)) {

            const body = this.entities[id][PhysicsComponent].body;
            const spd = this.entities[id][BasicEnemyAIComponent].speed;
            if (Math.abs(body.velocity[0]) != spd) {  // counteract friction
                body.velocity[0] = Math.sign(body.velocity[0]) * spd;
            }

            this.lastVel[id] = this.entities[id][PhysicsComponent].body.velocity[0];
            this.wasColliding[id] = false;

        }

    }

}