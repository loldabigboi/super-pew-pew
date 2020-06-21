class BasicEnemyAISystem extends System {

    constructor(scene) {
        super([BasicEnemyAIComponent, PhysicsComponent]);
        this.lastDirection = {};  // stores the last direction of the enemy body, either at spawn or after last horiz. collision
        this.wasColliding = {};  // stores whether the enemy was colliding with a wall the previous update
        scene.addEvent(new TransmittedEvent(null, null, PhysicsSystem, PhysicsSystem.ADD_LISTENER_EVENT, {
            type: 'impact',
            listener: (evt) => {
                const bodyA = evt.bodyA,
                      bodyB = evt.bodyB;

                let enemyBody, otherBody;
                if (this.lastDirection[bodyA.id]) {
                    enemyBody = bodyA;
                    otherBody = bodyB;
                } else if (this.lastDirection[bodyB.id]) {
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
                        enemyBody.velocity[0] = c[BasicEnemyAIComponent].speed * -this.lastDirection[enemyBody.id];
                        this.lastDirection[enemyBody.id] *= -1;
                    }

                }
            }
        }));
    }

    addEntity(id, components) {

        if (super.addEntity(id, components)) {
            this.lastDirection[id] = Math.sign(components[PhysicsComponent].body.velocity[0]);
        }

    }

    update(dt, entities) {

        for (const id of Object.keys(this.entities)) {
            this.wasColliding[id] = false;
        }

    }

}