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

    deleteEntity(id) {
        const c = this.entities[id];
        if (!c) {
            return;
        }
        super.deleteEntity(id);
        delete this.layers[c[RenderComponent].layer][id];
    }

    update(dt, entities, scene) {

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
    
                let pos = ParentComponent.getAbsolutePosition(entityID, entities);
                let xOffset = shapeC.flatOffset[0], 
                    yOffset = shapeC.flatOffset[1];
                if (transformC) {

                    if (shapeC.type === p2.Shape.BOX) {
                        xOffset += shapeC.propOffset[0]*shape.width;
                        yOffset += shapeC.propOffset[1]*shape.height;
                    } else if (shapeC.type === p2.Shape.CIRCLE) {
                        xOffset += shapeC.propOffset[0]*shape.radius;
                        yOffset += shapeC.propOffset[1]*shape.radius;
                    }
    
                } else {  // must have associated physics body (either their own or from another entity)
        
                    if (shapeC.type === p2.Shape.BOX) {
                        xOffset += shape.width*-0.5;
                        yOffset += shape.height*-0.5;
                    } else if (shapeC.type === p2.Shape.CIRCLE) {  
                        // circle drawing is already centered
                    }
    
                }

                ctx.save();

                ctx.globalAlpha = renderC.opacity;
                ctx.lineWidth = renderC.strokeWidth;
                
                ctx.strokeStyle = renderC.strokeColor;
                ctx.fillStyle = renderC.fillColor;

                ctx.translate(pos[0], pos[1]);
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
                } else if (shapeC.type === p2.Shape.CIRCLE) {
                    ctx.beginPath();
                    ctx.arc(0, 0, shapeC.shape.radius, 0, 2*Math.PI, false);    
                }

                ctx.fill();
                if (renderC.strokeColor) {
                    ctx.stroke();
                }
    
                ctx.restore();

            }
        }

    }

}
