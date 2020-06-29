class FlyingEnemyAISystem extends System {

    constructor() {

        super([FlyingEnemyAIComponent, PhysicsComponent]);

    }

    update(dt, entities, scene) {

        for (const entityID of Object.keys(this.entities)) {

            const c = this.entities[entityID];
            const flyingC = c[FlyingEnemyAIComponent];
            const physC = c[PhysicsComponent];
            
            const otherC = entities[flyingC.trackingID];

            if (!otherC) {  // other entity no longer exists
                continue;
            }

            const otherPhysC = otherC[PhysicsComponent];
            const sqrDist = p2.vec2.sqrDist(physC.body.position, otherPhysC.body.position);
            if (sqrDist < flyingC.endRadius*flyingC.endRadius && sqrDist > flyingC.startRadius*flyingC.startRadius) {
                physC.body.velocity[0] = Math.abs(physC.body.velocity[0]) * Math.sign(otherPhysC.body.position[0] - physC.body.position[0]);
            }

            if (p2.vec2.sqrLen(physC.body.velocity) > flyingC.speed*flyingC.speed) {
                p2.vec2.normalize(physC.body.velocity, physC.body.velocity);
                p2.vec2.scale(physC.body.velocity, physC.body.velocity, flyingC.speed);
            }

        }

    }

}