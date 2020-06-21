class TransformComponent extends Component {

    constructor(entityID, pos, angle) {

        super(entityID);

        this.position = pos;
        this.prevPosition = pos.slice();
        this.angle = angle;

    }

}

