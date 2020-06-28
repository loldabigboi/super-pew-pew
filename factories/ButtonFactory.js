class ButtonFactory {

    static createSimpleButton(entityID, layer, style, hoverStyle, pressedStyle) {

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, style.fill, style.stroke, style.strokeWidth, layer);
        c[MouseInteractableComponent] = new MouseInteractableComponent(entityID, {
            mouseenter: [(obj) => {
                c[RenderComponent].stroke = hoverStyle.stroke || style.stroke;
                c[RenderComponent].fill = hoverStyle.fill || style.fill;
                c[RenderComponent].strokeWidth = hoverStyle.strokeWidth || style.strokeWidth;
                c[RenderComponent].opacity = hoverStyle.opacity || style.opacity;
            }],
            mouseleave: [(obj) => {
                c[RenderComponent].stroke = style.stroke;
                c[RenderComponent].fill = style.fill;
                c[RenderComponent].strokeWidth = style.strokeWidth;
                c[RenderComponent].opacity = style.opacity;
            }],
            mousedown: [(obj) => {
                c[RenderComponent].stroke = pressedStyle.stroke || hoverStyle.stroke || style.stroke;
                c[RenderComponent].fill = pressedStyle.fill || hoverStyle.fill || style.fill;
                c[RenderComponent].strokeWidth = pressedStyle.strokeWidth || hoverStyle.strokeWidth || style.strokeWidth;
                c[RenderComponent].opacity = pressedStyle.opacity || hoverStyle.opacity || style.opacity;
            }],
            mouseup: [(obj) => {
                c[RenderComponent].stroke = hoverStyle.stroke || style.stroke;
                c[RenderComponent].fill = hoverStyle.fill || style.fill;
                c[RenderComponent].strokeWidth = hoverStyle.strokeWidth || style.strokeWidth;
                c[RenderComponent].opacity = hoverStyle.opacity || style.opacity;
            }]
        }, layer);

        return c;

    }

}