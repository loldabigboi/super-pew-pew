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
            const otherPhysicsC = otherC[PhysicsComponent];

            if (trackC.scale && trackC.scale != 1) {  // if tracking should not be 1:1 ratio 
                if (otherTransC) {
                    transC.pos[0] += (otherTransC.pos[0] - otherTransC.prevPos[0]) * trackC.scale;
                    transC.pos[1] += (otherTransC.pos[1] - otherTransC.prevPos[1]) * trackC.scale;
                } else if (otherPhysicsC) {
                    transC.pos[0] += (otherPhysicsC.body.position[0] - otherPhysicsC.body.previousPosition[0]) * trackC.scale;
                    transC.pos[1] += (otherPhysicsC.body.position[1] - otherPhysicsC.body.previousPosition[1]) * trackC.scale;
                } else {
                    throw new Error(`Entity(${trackC.trackingID}) does not have a Physics or Transform Component.`);
                }
            } else {  // 1:1 tracking
                
                let otherOffsetX, otherOffsetY, otherX, otherY, otherWidth, otherHeight;
                if (otherTransC) {  // entity has a transform component
                    otherOffsetX = otherTransC.offset[0];
                    otherOffsetY = otherTransC.offset[1];
                    otherX = otherTransC.pos[0];
                    otherY = otherTransC.pos[1];
                    otherWidth = otherTransC.width;
                    otherHeight = otherTransC.height;
                } else if (otherPhysicsC) {  // entity has a physics component
                    otherOffsetX = 0.5;  // p2 bodies have their position at their center
                    otherOffsetY = 0.5;
                    otherX = otherPhysicsC.body.position[0];
                    otherY = otherPhysicsC.body.position[1];
                    if (otherPhysicsC.shape instanceof p2.Box) {
                        otherWidth = otherPhysicsC.shape.width;
                        otherHeight = otherPhysicsC.shape.height;
                    } else if (otherPhysicsC.shape instanceof p2.Circle) {
                        otherWidth = otherPhysicsC.shape.radius*2;
                        otherHeight = otherPhysicsC.shape.radius*2;
                    } else {
                        throw new Error(`${otherPhysicsC.shape.constructor.name} not supported for tracking.`)
                    }
                }
    
                const xRelOffset = trackC.relOffset[0] - otherOffsetX,
                      yRelOffset = trackC.relOffset[1] - otherOffsetY;

                transC.prevPos = transC.pos.slice();
    
                transC.pos[0] = otherX + otherWidth  * xRelOffset + trackC.absOffset[0],
                transC.pos[1] = otherY + otherHeight * yRelOffset + trackC.absOffset[1];
                
            }
            
        }

    }

}