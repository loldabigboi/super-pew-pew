class GUIFactory {

    static createSimpleButton(entityID, layer, style, hoverStyle, pressedStyle) {
        
        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, style, layer);
        c[MouseInteractableComponent] = new MouseInteractableComponent(entityID, {
            mouseenter: [(obj) => {
                c[RenderComponent].style = hoverStyle || style;
                if (c[TextRenderComponent]) {
                    c[TextRenderComponent].style = hoverStyle || style;
                }
            }],
            mouseleave: [(obj) => {
                c[RenderComponent].style = style;
                if (c[TextRenderComponent]) {
                    c[TextRenderComponent].style = style;
                }
            }],
            mousedown: [(obj) => {
                c[RenderComponent].style = pressedStyle || hoverStyle || style;
                if (c[TextRenderComponent]) {
                    c[TextRenderComponent].style = pressedStyle || hoverStyle || style;
                }
            }],
            mouseup: [(obj) => {
                c[RenderComponent].style = hoverStyle || style;
                if (c[TextRenderComponent]) {
                    c[TextRenderComponent].style = hoverStyle || style;
                }
            }]
        }, layer);

        return c;

    }

     static createButtonDependent(entityID, buttonC, style={stroke: 'inherit', fill:'inherit'}, hoverStyle={}, pressedStyle={}) {
        
        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, style, 'inherit', 'inherit');
        c[RenderComponent].render = 'inherit';
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, buttonC[MouseInteractableComponent].entityID, [0,0], [0,0]);
        
        buttonC[MouseInteractableComponent].listeners.mouseenter.push((obj) => {
            c[RenderComponent].style = hoverStyle || style;
        });
        buttonC[MouseInteractableComponent].listeners.mouseleave.push((obj) => {
            c[RenderComponent].style = style;
        });
        buttonC[MouseInteractableComponent].listeners.mousedown.push((obj) => {
            c[RenderComponent].style = pressedStyle || hoverStyle || style;
        });
        buttonC[MouseInteractableComponent].listeners.mouseup.push((obj) => {
            c[RenderComponent].style = hoverStyle || style;
        });

        return c;

    }

}