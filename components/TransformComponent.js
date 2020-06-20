class TransformComponent extends Component {

    constructor(entityID, pos, angle) {

        super(entityID);

        this.pos = pos;
        this.prevPos = pos.slice();
        this.angle = angle;

    }

}

