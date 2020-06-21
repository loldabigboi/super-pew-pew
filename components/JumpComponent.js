class JumpComponent extends Component {

    constructor(entityID, strengthArray) {

        super(entityID);
        this.strengthArray = strengthArray;
        this.jumpI = 0;  // index of current jump
        this.canJump = true;

    }

}