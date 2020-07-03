class RenderComponent extends Component {

    constructor(entityID, style, layer=0, isStatic=false) {

        super(entityID);

        this.style = style;
        this.layer = layer;

        this.render = true;  // flag indicating whether this entity should be rendered
        this.isStatic = isStatic;

    }

    set style(newStyle) {

        this.fill = newStyle.fill || this.fill || {};
        this.stroke = newStyle.stroke || this.stroke || {};

        this.strokeWidth = newStyle.strokeWidth || this.strokeWidth || 0;
        this.opacity = newStyle.opacity || this.opacity || 1;

        this.shadowBlur = newStyle.shadowBlur || this.shadowBlur || 0;
        this.shadowColor = newStyle.shadowColor || this.shadowColor;

    }

}