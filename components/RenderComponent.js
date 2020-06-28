class RenderComponent extends Component {

    constructor(entityID, fill, stroke, strokeWidth=1, layer=0, isStatic=false, opacity=1) {

        super(entityID);

        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.layer = layer;
        this.opacity = opacity;

        this.isStatic = isStatic;  // whether this entity is affected by the RenderSystem offset
        this.render = true;  // flag indicating whether this 

    }

}