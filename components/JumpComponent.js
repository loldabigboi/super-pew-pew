class JumpComponent extends Component {

    constructor(entityID, initialStrength, totalBoost, boostRate) {

        super(entityID);

        this.initialStrength = initialStrength;
        this.totalBoost = totalBoost;
        this.remainingBoost = totalBoost;
        this.boostRate = boostRate;
        this.didJump = false;
        this.canJump = false;

    }

}