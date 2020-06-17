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
                    transC.x += (otherTransC.x - otherTransC.prevX) * trackC.scale;
                    transC.y += (otherTransC.y - otherTransC.prevY) * trackC.scale;
                } else if (otherPhysicsC) {
                    transC.x += (otherPhysicsC.body.position[0] - otherPhysicsC.body.previousPosition[0]) * trackC.scale;
                    transC.y += (otherPhysicsC.body.position[1] - otherPhysicsC.body.previousPosition[1]) * trackC.scale;
                } else {
                    throw new Error(`Entity(${trackC.trackingID}) does not have a Physics or Transform Component.`);
                }
            } else {  // 1:1 tracking
                
                const otherOffsetX, otherOffsetY, otherX, otherY, otherWidth, otherHeight;
                if (otherTransC) {  // entity has a transform component
                    otherOffsetX = otherTransC.offset[0];
                    otherOffsetY = otherTransC.offset[1];
                    otherX = otherTransC.x;
                    otherY = otherTransC.y;
                    otherWidth = otherTransC.width;
                    otherHeight = otherTransC.height;
                } else if (otherPhysicsC) {  // entity has a physics component
                    otherOffsetX = 0.5;  // p2 bodies have their position at their center
                    otherOffsetY = 0.5;
                    otherX = otherPhysicsC.body.position[0];
                    otherY = otherPhysicsC.body.position[1];
                    if (otherPhysicsC.shape instanceof p2.Box) {
                        otherWidth = otherPhysicsC.shape.width;
                        otherHeight = otherPhysicsC.shape.width;
                    } else if (otherPhysicsC.shape instanceof p2.Circle) {
                        otherWidth = otherPhysicsC.shape.radius*2;
                        otherHeight = otherPhysicsC.shape.radius*2;
                    } else {
                        throw new Error(`${otherPhysicsC.shape.constructor.name} not supported for tracking.`)
                    }
                }
    
                const xRelOffset = trackC.relOffset[0] - otherOffsetX,
                      yRelOffset = trackC.relOffset[1] - otherOffsetY;

                transC.prevX = transC.x;
                transC.prevY = transC.y;
    
                transC.x = otherX + otherWidth  * xRelOffset + trackC.absOffset[0],
                transC.y = otherY + otherHeight * yRelOffset + trackC.absOffset[1];
 
            }
            
        }

    }

}