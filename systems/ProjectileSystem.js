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
            } else if (otherShape.collisionGroup == ShapeComponent.GROUPS.ENEMY) {
                this.entities[projShape.body.id][ProjectileComponent].currPenetrationDepth++;
            }

        });

    }

    deleteEntity(id) {
        console.log(id);
        console.log(Object.keys(this.entities));
        super.deleteEntity(id);
        console.log(Object.keys(this.entities));
    }

    update(dt, entities) {

        let deletionEvents = [];
        for (const entityID of Object.keys(this.entities)) {

            const c = this.entities[entityID];
            const projC = c[ProjectileComponent];
            const physC = c[PhysicsComponent];
            if (projC.currBounces >= projC.maxBounces || projC.currPenetrationDepth >= projC.maxPenetrationDepth) {
                physC.body.interpolatedPosition = physC.body.previousPosition.slice();
                deletionEvents.push(new TransmittedEvent(null, null, null, GameScene.DELETE_ENTITY_EVENT, {id: entityID}));
            }

        }

        return deletionEvents;

    }

}