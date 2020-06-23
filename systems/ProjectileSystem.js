class ProjectileSystem extends System {

    constructor(world) {

        super([ProjectileComponent, PhysicsComponent]);
        this.world = world;

        this.world.on('beginContact', (evt) => {

            let projShape, otherShape;
            if (evt.shapeA.collisionGroup === ShapeComponent.GROUPS.PROJ) {
                projShape  = evt.shapeA;
                otherShape = evt.shapeB;
            } else if (evt.shapeB.collisionGroup === ShapeComponent.GROUPS.PROJ) {
                projShape  = evt.shapeB;
                otherShape = evt.shapeA;
            } else {
                return;
            }

            if (otherShape.collisionGroup == ShapeComponent.GROUPS.GROUND) {
                this.entities[projShape.body.id][ProjectileComponent].currBounces++;
            }

        });

    }

    update(dt, entities) {

        let deletionEvents = [];
        for (const entityID of Object.keys(this.entities)) {

            const c = this.entities[entityID];
            const projC = c[ProjectileComponent];
            const physC = c[PhysicsComponent];
            if (projC.currBounces >= projC.maxBounces) {
                physC.body.interpolatedPosition = physC.body.previousPosition.slice();
                deletionEvents.push(new TransmittedEvent(null, entityID, null, GameScene.DELETE_ENTITY_EVENT));
            }

        }

        return deletionEvents;

    }

}