class TeleporterSystem extends System {

    constructor(world) {

        super([TeleporterComponent, PhysicsComponent]);

        world.on('beginContact', (evt) => {

            let teleBody, otherBody;
            if (this.entities[evt.bodyA.id]) {
                teleBody = evt.bodyA;
                otherBody = evt.bodyB;
            } else if (this.entities[evt.bodyB.id]) {
                teleBody = evt.bodyB;
                otherBody = evt.bodyA;
            } else {
                return;
            }

            this.entities[teleBody.id][TeleporterComponent].toBeTeleported.push(otherBody.id);

        });

    }

    update(dt, entities) {

        for (const entityID of Object.keys(this.entities)) {

            const c = this.entities[entityID];
            const teleC = c[TeleporterComponent];

            for (let i = 0; i < teleC.toBeTeleported.length; i++) {
                const id = teleC.toBeTeleported.shift();
                const physC  = entities[id][PhysicsComponent]

                if (!physC) {
                    throw new Error(`cannot teleport entity '${id}' with no physics component`);
                }
                physC.body.position = teleC.targetPosition.slice();
                physC.body.interpolatedPosition = physC.body.position.slice();
                teleC.onTeleport({
                    teleID: entityID,
                    otherID: id,
                    components: entities[entityID],
                    otherComponents: entities[id]
                });
            }

        }

    }

}