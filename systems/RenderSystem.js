class RenderSystem extends System {

    constructor() {

        super([
            RenderComponent,
            ShapeComponent
        ])
        this.layers = {};

    }

    addEntity(id, components) {

        for (const c of this.requiredComponents) {
            if (!components[c]) {
                //console.log("Required component '" + c.name + "' not included for '" + this.constructor.name + "'.");
                return false;  // entity not added
            }
        }

        const c = components;
        this.entities[id] = c;
        if (!this.layers[c[RenderComponent].layer]) {
            this.layers[c[RenderComponent].layer] = {}
        } 
        this.layers[c[RenderComponent].layer][id] = c;

        return true;  // entity added

    }

    update() {

        const canvas = document.getElementsByTagName('canvas')[0];
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (const layer of Object.keys(this.layers).sort()) {
            for (const entityID of Object.keys(this.layers[layer])) {

                const c = this.entities[entityID];
                const transformC = c[TransformComponent];
                const renderC = c[RenderComponent];
                const shapeC = c[ShapeComponent];
                const shape = shapeC.shape;
    
                ctx.strokeStyle = renderC.strokeColor;
                ctx.fillStyle = renderC.fillColor;
    
                let x, y;
                let xOffset, yOffset;
                if (transformC) {
                    x = transformC.position[0],
                    y = transformC.position[1];
    
                    xOffset = shapeC.absOffset[0];
                    yOffset = shapeC.absOffset[1];
                    if (shapeC.type === p2.Shape.BOX) {
                        xOffset += shapeC.propOffset[0]*shape.width;
                        yOffset += shapeC.propOffset[1]*shape.height;
                    } else if (shapeC.type === p2.Shape.CIRCLE) {
                        xOffset += shapeC.propOffset[0]*shape.radius;
                        yOffset += shapeC.propOffset[1]*shape.radius;
                    }
    
                } else {  // must have associated physics body (either their own or from another entity)
    
                    const body = shapeC.body;
                    const pos = body.interpolatedPosition;
                    x = pos[0] + shape.position[0];
                    y = pos[1] + shape.position[1];
    
                    if (shapeC.type === p2.Shape.BOX) {
                        xOffset = shape.width*-0.5;
                        yOffset = shape.height*-0.5;
                    } else if (shapeC.type === p2.Shape.CIRCLE) {  // circle drawing is already centered
                        xOffset = 0;
                        yOffset = 0;
                    }
    
                }
    
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(shapeC.angle);
    
                if (transformC) {
                    ctx.rotate(transformC.angle);
                } else {
                    ctx.rotate(shapeC.body.angle);
                }
                
                ctx.translate(xOffset, yOffset);
                
                if (shapeC.type === p2.Shape.BOX) {
    
                    ctx.beginPath();
                    ctx.rect(0, 0, shapeC.shape.width, shapeC.shape.height);
                    ctx.fill();
                    ctx.stroke();
    
                } else if (shapeC.type === p2.Shape.CIRCLE) {
    
                    ctx.beginPath();
                    ctx.arc(0, 0, shapeC.shape.radius, 0, 2*Math.PI, false);
                    ctx.fill();
                    ctx.stroke();
    
                }
    
                ctx.restore();

            }
        }

    }

}
