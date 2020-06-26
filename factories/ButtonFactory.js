class ButtonFactory {

    static createSimpleButton(entityID, style, hoverStyle, pressedStyle) {

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, style.fill, style.stroke, style.strokeWidth, 1, style.opacity || 1);
        c[MouseInteractableComponent] = new MouseInteractableComponent(entityID, {
            onMouseEnter: [(obj) => {
                c[RenderComponent].stroke = hoverStyle.stroke || style.stroke;
                c[RenderComponent].fill = hoverStyle.fill || style.fill;
                c[RenderComponent].strokeWidth = hoverStyle.strokeWidth || style.strokeWidth;
                c[RenderComponent].opacity = hoverStyle.opacity || style.opacity;
            }],
            onMouseLeave: [(obj) => {
                c[RenderComponent].stroke = style.stroke;
                c[RenderComponent].fill = style.fill;
                c[RenderComponent].strokeWidth = style.strokeWidth;
                c[RenderComponent].opacity = style.opacity;
            }],
            onMouseDown: [(obj) => {
                c[RenderComponent].stroke = pressedStyle.stroke || hoverStyle.stroke || style.stroke;
                c[RenderComponent].fill = pressedStyle.fill || hoverStyle.fill || style.fill;
                c[RenderComponent].strokeWidth = pressedStyle.strokeWidth || hoverStyle.strokeWidth || style.strokeWidth;
                c[RenderComponent].opacity = pressedStyle.opacity || hoverStyle.opacity || style.opacity;
            }],
            onMouseUp: [(obj) => {
                c[RenderComponent].stroke = hoverStyle.stroke || style.stroke;
                c[RenderComponent].fill = hoverStyle.fill || style.fill;
                c[RenderComponent].strokeWidth = hoverStyle.strokeWidth || style.strokeWidth;
                c[RenderComponent].opacity = hoverStyle.opacity || style.opacity;
            }]
        });

        return c;

    }

}