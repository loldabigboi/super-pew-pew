class RenderSystem extends System {

    constructor() {

        super([
            RenderComponent
        ])
        this.layers = {};

        this.offset = [0,0];  // absolute offset of the rendering, used to pan the 'camera'
        this.tempOffset = [100,0];  // resets after every update, used for e.g. camera shake

    }

    addEntity(id, components) {

        if (!(components[ShapeComponent]   || components[TextRenderComponent]) ||
            !(components[PhysicsComponent] || components[TransformComponent])) {
            return false;  // must either have a shape component or a text render component, and a transform or physics component
        }

        if (super.addEntity(id, components)) {
            const c = components;
            this.entities[id] = c;
            if (!this.layers[c[RenderComponent].layer]) {
                this.layers[c[RenderComponent].layer] = {}
            } 
            this.layers[c[RenderComponent].layer][id] = c;
            
            return true;  // entity added
        }

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
                const textC = c[TextRenderComponent];

                if (!ParentComponent.getInheritedValue(entityID, entities, RenderComponent, 'render')) {
                    continue;
                }

                ctx.save();

                if (!ParentComponent.getInheritedValue(entityID, entities, RenderComponent, 'isStatic')) {
                    ctx.translate(this.offset[0] + this.tempOffset[0], this.offset[1] + this.tempOffset[1]);
                }

                ctx.globalAlpha = ParentComponent.getInheritedValue(entityID, entities, RenderComponent, 'opacity');
                ctx.lineWidth = ParentComponent.getInheritedValue(entityID, entities, RenderComponent, 'strokeWidth');
                
                ctx.strokeStyle = ParentComponent.getInheritedValue(entityID, entities, RenderComponent, 'stroke');
                ctx.fillStyle = ParentComponent.getInheritedValue(entityID, entities, RenderComponent, 'fill');

                if (shapeC) {

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

                    ctx.translate(pos[0], pos[1]);
                    ctx.translate(-offset[0], -offset[1])
                    
                    if (transformC) {
                        ctx.rotate(transformC.angle);
                    } else {
                        ctx.rotate(shapeC.body.angle + shapeC.shape.angle);
                    }

                    ctx.translate(offset[0], offset[1]);
                                    
                    if (shapeC.type === p2.Shape.BOX) {
                        ctx.beginPath();
                        ctx.rect(-w/2, -h/2, w, h);
                    } else if (shapeC.type === p2.Shape.CIRCLE) {
                        ctx.beginPath();
                        ctx.arc(0, 0, w, 0, 2*Math.PI, false);    
                    }

                    if (renderC.fill) {
                        ctx.fill();
                    }
                    if (renderC.stroke) {
                        ctx.stroke();
                    }
        

                } else {

                    ctx.font = ParentComponent.getInheritedValue(entityID, entities, TextRenderComponent, 'fontSize') + 'px ' + 
                               ParentComponent.getInheritedValue(entityID, entities, TextRenderComponent, 'fontFamily');
                    ctx.textBaseline = 'middle';
                    const metrics = ctx.measureText(textC.text);
                    const w = metrics.width;
                    const h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

                    const pos = ParentComponent.getAbsolutePosition(entityID, entities, undefined);
                    ctx.translate(pos[0], pos[1]);

                    if (transformC) {
                        ctx.rotate(transformC.angle);
                    }

                    // base y offset is 0.5h as text renders using the y coord of the bottom of the text
                    ctx.translate((-0.5 + textC.propOffset[0])*w, (textC.propOffset[1])*h);                    

                    if (renderC.fill) {
                        ctx.fillText(textC.text, 0, 0);
                    }
                    if (renderC.stroke) {
                        ctx.strokeText(textC.text, 0, 0);
                    }

                } 

                ctx.restore();

            }
        }
        this.tempOffset = [0,0];

    }

}
