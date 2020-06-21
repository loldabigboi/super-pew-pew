class TrackingSystem extends System {

    constructor() {
        super([TrackingComponent]);
    }

    update(dt, entities) {

        for (const entityID of Object.keys(this.entities)) {

            const c = this.entities[entityID];
            const trackC = c[TrackingComponent];
            const transC = c[TransformComponent];
            const physC = c[PhysicsComponent];
            const otherC = entities[trackC.trackingID];
            const otherShapeC = otherC[ShapeComponent];
            const otherTransC = otherC[TransformComponent];

            const position = transC ? transC.position : physC.body.interpolatedPosition;

            if (trackC.scale && trackC.scale != 1) {  // if tracking should not be 1:1 ratio 
                if (otherTransC) {
                    position[0] += (otherTransC.pos[0] - otherTransC.prevPos[0]) * trackC.scale;
                    position[1] += (otherTransC.pos[1] - otherTransC.prevPos[1]) * trackC.scale;
                } else if (otherPhysicsC) {
                    position[0] += (otherShapeC.body.position[0] - otherPhysicsC.body.previousPosition[0]) * trackC.scale;
                    position[1] += (otherShapeC.body.position[1] - otherPhysicsC.body.previousPosition[1]) * trackC.scale;
                } else {
                    throw new Error(`Entity(${trackC.trackingID}) does not have a Physics or Transform Component.`);
                }
            } else {  // 1:1 tracking
                
                let otherOffsetX, otherOffsetY, otherX, otherY, otherWidth, otherHeight;
                if (otherTransC) {  // entity has a transform component
                    
                    otherX = otherTransC.pos[0];
                    otherY = otherTransC.pos[1];

                    if (otherPhysicsC.shape) {

                        if (otherPhysicsC.shape instanceof p2.Box) {
                            otherWidth = otherPhysicsC.shape.width;
                            otherHeight = otherPhysicsC.shape.height;
                        } else if (otherPhysicsC.shape instanceof p2.Circle) {
                            otherWidth = otherPhysicsC.shape.radius*2;
                            otherHeight = otherPhysicsC.shape.radius*2;
                        } else {
                            throw new Error(`${otherPhysicsC.shape.constructor.name} not supported for tracking.`)
                        }

                    }  else {

                        otherOffsetX = 0;
                        otherOffsetY = 0;
                        otherWidth = 0;
                        otherHeight = 0;

                    }

                } else if (otherShapeC.body) {  // entity has an associated physics body
                    
                    otherOffsetX = -0.5;  // p2 shapes have their position at their center
                    otherOffsetY = -0.5;
                    otherX = otherShapeC.body.position[0] + otherShapeC.shape.position[0];
                    otherY = otherShapeC.body.position[1] + otherShapeC.shape.position[1];
                    
                    if (otherShapeC.type === p2.Shape.BOX) {
                        otherWidth = otherShapeC.shape.width;
                        otherHeight = otherShapeC.shape.height;
                    } else if (otherShapeC.type === p2.Shape.CIRCLE) {
                        otherHeight = otherShapeC.shape.radius;
                        otherHeight = otherShapeC.shape.radius;
                    }

                }
                const xRelOffset = trackC.relOffset[0] - otherOffsetX,
                      yRelOffset = trackC.relOffset[1] - otherOffsetY;
                
                if (transC) {
                    transC.prevPosition = transC.position.slice();
                } else if (physC) {
                    physC.body.previousPosition = physC.body.position.slice();
                }
                
                position[0] = otherX + otherWidth  * xRelOffset + trackC.absOffset[0];
                position[1] = otherY + otherHeight * yRelOffset + trackC.absOffset[1];
                
            }
            
        }

    }

}