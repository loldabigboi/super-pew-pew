class TransformComponent extends Component {

    constructor(entityID, pos, posOffset, width, height, angle) {

        super(entityID);

        this.pos = pos;
        this.prevPos = pos.slice();
        this.posOffset = posOffset;
        this.width = width;
        this.height = height;
        this.angle = angle;

    }

}

TransformComponent.TOP_LEFT = [0, 0];
TransformComponent.TOP_CENTER = [0.5, 0];
TransformComponent.TOP_RIGHT = [1, 0];
TransformComponent.CENTER_LEFT = [0, 0.5];
TransformComponent.CENTER = [0.5, 0.5];
TransformComponent.CENTER_RIGHT = [1, 0.5];
TransformComponent.BOTTOM_LEFT = [0, 1];
TransformComponent.BOTTOM_CENTER = [0.5, 1];
TransformComponent.BOTTOM_RIGHT = [1, 1];

