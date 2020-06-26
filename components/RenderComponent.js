class RenderComponent extends Component {

    constructor(entityID, fill, stroke, strokeWidth=1, layer=0, opacity=1) {

        super(entityID);

        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.layer = layer;
        this.opacity = opacity;

    }

}