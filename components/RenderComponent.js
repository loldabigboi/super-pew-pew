class RenderComponent extends Component {

    constructor(entityID, fillColor, strokeColor, layer=0, opacity=1) {

        super(entityID);

        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.layer = layer;
        this.opacity = opacity;

    }

}