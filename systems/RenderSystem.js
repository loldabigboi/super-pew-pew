class RenderSystem extends System {

    constructor() {

        super([
            RenderComponent
        ])
        this.layers = {};

        this.offset = [0,0];  // absolute offset of the rendering, used to pan the 'camera'
        this.tempOffset = [0,0];  // resets after every update, used for e.g. camera shake

    }

    addEntity(id, components, entities) {

        if (!(components[ShapeComponent]   || components[TextRenderComponent]) ||
            !(components[PhysicsComponent] || components[TransformComponent])) {
            return false;  // must either have a shape component or a text render component, and a transform or physics component
        }

        if (super.addEntity(id, components)) {
            const layer = ParentComponent.getInheritedValue(id, entities, RenderComponent, 'layer'),
                  c = components;
            this.entities[id] = c;
            if (!this.layers[layer]) {
                this.layers[layer] = {}
            } 
            this.layers[layer][id] = c;
            
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
        const ctx = canvas.getContext('2d', {alpha: false});
        
        for (const layer of Object.keys(this.layers).sort()) {
            for (const entityID of Object.keys(this.layers[layer])) {

                const c = this.entities[entityID];
                const transformC = c[TransformComponent];
                const renderC = c[RenderComponent];
                const filterC = c[RenderFilterComponent]
                const shapeC = c[ShapeComponent];
                const textC = c[TextRenderComponent];
                const imageC = c[ImageRenderComponent];

                if (!ParentComponent.getInheritedValue(entityID, entities, RenderComponent, 'render')) {
                    continue;
                }

                let fillStr = RenderSystem.toColorString(renderC.fill),
                    strokeStr = RenderSystem.toColorString(renderC.stroke);

                ctx.save();

                if (filterC) {

                    if (filterC.type == 'blur') {
                        const amt = filterC.obj.amount;
                        ctx.filter = 'blur(' + amt + 'px)';
                    }  

                }

                if (renderC.shadowBlur) {
                    ctx.shadowBlur = renderC.shadowBlur;
                    if (renderC.shadowColor == 'stroke') {
                        ctx.shadowColor = strokeStr;
                    } else if (renderC.shadowColor == 'fill') {
                        ctx.shadowColor = fillStr;
                    } else {
                        ctx.shadowColor = RenderSystem.toColorString(renderC.shadowColor);
                    }
                }

                if (!ParentComponent.getInheritedValue(entityID, entities, RenderComponent, 'isStatic')) {
                    ctx.translate(this.offset[0] + this.tempOffset[0], this.offset[1] + this.tempOffset[1]);
                }

                ctx.globalAlpha = ParentComponent.getInheritedValue(entityID, entities, RenderComponent, 'opacity');
                ctx.lineWidth = ParentComponent.getInheritedValue(entityID, entities, RenderComponent, 'strokeWidth');
                
                ctx.strokeStyle = strokeStr;
                ctx.fillStyle = fillStr;

                const transCAngle = !transformC ? 0 : ParentComponent.getInheritedValue(entityID, entities, TransformComponent, 'angle');
                if (textC) {

                    ctx.font = ParentComponent.getInheritedValue(entityID, entities, TextRenderComponent, 'fontSize') + 'px ' + 
                               ParentComponent.getInheritedValue(entityID, entities, TextRenderComponent, 'fontFamily');
                    ctx.textBaseline = 'middle';
                    const metrics = ctx.measureText(textC.text);
                    const w = metrics.width;
                    const h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

                    const pos = ParentComponent.getAbsolutePosition(entityID, entities, undefined);
                    ctx.translate(pos[0], pos[1]);

                    if (transformC) {
                        ctx.rotate(transCAngle);
                    }

                    // base y offset is 0.5h as text renders using the y coord of the bottom of the text
                    ctx.translate((-0.5 + textC.propOffset[0])*w, (textC.propOffset[1])*h);                    

                    if (fillStr) {
                        ctx.fillText(textC.text, 0, 0);
                    }
                    if (strokeStr) {
                        ctx.strokeText(textC.text, 0, 0);
                    }

                } else if (shapeC) {

                    const shape = shapeC.shape;

                    let w, h;
                    if (shapeC.type == p2.Shape.BOX) {
                        w = shape.width;
                        h = shape.height;
                    } else if (shapeC.type == p2.Shape.CIRCLE) {
                        w = shape.radius;
                        h = shape.radius;
                    } else if (shapeC.type == p2.Shape.LINE) {
                        w = shape.length;
                        h = 0;
                    }
        
                    let pos = ParentComponent.getAbsolutePosition(entityID, entities, [0,0]);
                    const offset = [shapeC.flatOffset[0] + shapeC.propOffset[0]*w, 
                                    shapeC.flatOffset[1] + shapeC.propOffset[1]*h];

                    ctx.translate(pos[0], pos[1]);
                    ctx.translate(-offset[0], -offset[1])
                    
                    if (transformC) {
                        ctx.rotate(transCAngle);
                    } else {
                        ctx.rotate(shapeC.body.angle + shapeC.shape.angle);
                    }

                    ctx.translate(offset[0], offset[1]);

                    if (imageC) {
                        ctx.drawImage(ResourceManager.getResource(imageC.imageID), -shape.width/2, -shape.height/2, shape.width, shape.height);
                    } else {

                        if (shapeC.type === p2.Shape.BOX) {
                            ctx.beginPath();
                            ctx.rect(-w/2, -h/2, w, h);
                        } else if (shapeC.type === p2.Shape.CIRCLE) {
                            ctx.beginPath();
                            ctx.arc(0, 0, w, 0, 2*Math.PI, false);    
                        } else if (shapeC.type === p2.Shape.LINE) {
                            ctx.beginPath();
                            ctx.moveTo(-w/2, 0);
                            ctx.lineTo(w/2, 0);
                        }
    
                        if (fillStr) {
                            ctx.fill();
                        }
                        if (strokeStr) {
                            ctx.stroke();
                        }

                    }
        

                }

                ctx.restore();

            }
        }
        this.tempOffset = [0,0];

    }

    static toColorString(colourObj) {

        if (!colourObj) {
            return '';
        }

        let colourStr;
        if (colourObj.r != undefined) {  // rgb
            colourStr = 'rgb(' + colourObj.r + ',' + colourObj.g + ','  + colourObj.b + ',' + (colourObj.a != undefined ? colourObj.a : '1') + ')';
        } else if (colourObj.h != undefined) {  // hsl
            colourStr = 'hsl(' + colourObj.h + ',' + colourObj.s + '%,' + colourObj.l + '%,' + (colourObj.a != undefined ? colourObj.a : '1') + ')';
        }

        return colourStr;

    }

}
