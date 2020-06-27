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

                let w, h;
                if (shapeC.type == p2.Shape.BOX) {
                    w = shape.width;
                    h = shape.height;
                } else {
                    w = shape.radius;
                    h = shape.radius;
                }
    
                let pos = ParentComponent.getAbsolutePosition(entityID, entities, [0,0]);
                const offset = [shapeC.flatOffset[0] + shapeC.propOffset[0]*w, 
                                shapeC.flatOffset[1] + shapeC.propOffset[1]*h]


                ctx.save();

                ctx.globalAlpha = renderC.opacity;
                ctx.lineWidth = renderC.strokeWidth;
                
                ctx.strokeStyle = renderC.stroke;
                ctx.fillStyle = renderC.fill;

                ctx.translate(pos[0] + this.offset[0] + this.tempOffset[0], 
                              pos[1] + this.offset[1] + this.tempOffset[1]);
                ctx.translate(-offset[0], -offset[1])
                
                if (transformC) {
                    ctx.rotate(transformC.angle);
                } else {
                    ctx.rotate(shapeC.body.angle);
                }

                ctx.translate(offset[0], offset[1]);
                                
                if (shapeC.type === p2.Shape.BOX) {
                    ctx.beginPath();
                    ctx.rect(-w/2, -h/2, w, h);
                } else if (shapeC.type === p2.Shape.CIRCLE) {
                    ctx.beginPath();
                    ctx.arc(0, 0, w, 0, 2*Math.PI, false);    
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
