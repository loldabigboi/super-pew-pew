class RenderComponent extends Component {

    constructor(entityID, fillColor, strokeColor, layer=0) {

        super(entityID);

        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.layer = layer;

    }

}