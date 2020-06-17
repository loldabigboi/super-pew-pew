class RenderComponent extends Component {

    constructor(entityID, xOffset, yOffset, offsetType, rotOffset, fillColor, strokeColor) {

        super(entityID);

        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.offsetType = offsetType; 
        this.rotOffset = rotOffset;

        this.fillColor = fillColor;
        this.strokeColor = strokeColor;

    }

}

RenderComponent.ABS_OFFSET = "abs";  // absolute pixel value
RenderComponent.PRO_OFFSET = "pro";  // proportional to dimensions (e.g. 0.5 = 50% of entity width to the right)
