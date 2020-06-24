class RenderComponent extends Component {

    constructor(entityID, fillColor, strokeColor, strokeWidth=1, layer=0, opacity=1) {

        super(entityID);

        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.layer = layer;
        this.opacity = opacity;

    }

}