class TrackingSystem extends System {

    constructor() {
        super([TrackingComponent, TransformComponent]);
    }

    update(dt, entities) {

        for (const entityID of Object.keys(this.entities)) {

            const c = this.entities[entityID];
            const trackC = c[TrackingComponent];
            const transC = c[TransformComponent];
            const otherC = entities[trackC.trackingID];
            const otherTransC = otherC[TransformComponent];

            const xRelOffset = trackC.relOffset[0] - otherTransC.offset[0],
                  yRelOffset = trackC.relOffset[1] - otherTransC.offset[1];

            const relX = otherTransC.width  * xRelOffset + trackC.absOffset[0],
                  relY = otherTransC.height * yRelOffset + trackC.absOffset[1];
            transC.x = transC.x + (otherTransC.x + relX - transC.x) * trackC.scale[0];
            transC.y = transC.y + (otherTransC.y + relY - transC.y) * trackC.scale[1];

        }

    }

}