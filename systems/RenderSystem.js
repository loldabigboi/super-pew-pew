class RenderSystem extends System {

    constructor() {

        super([
            RenderComponent,
            ShapeComponent
        ])
        this.layers = {};

        this.offset = [0,0];  // absolute offset of the rendering, used to pan the 'camera'
        this.tempOffset = [100,0];  // resets after every update, used for e.g. camera shake

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
                
                ctx.strokeStyle = renderC.stroke;
                ctx.fillStyle = renderC.fill;

                ctx.translate(pos[0] + this.offset[0] + this.tempOffset[0], pos[1] + this.offset[1] + this.tempOffset[1]);
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
                if (renderC.stroke) {
                    ctx.stroke();
                }
    
                ctx.restore();

            }
        }

        this.tempOffset = [0,0];

    }

}
