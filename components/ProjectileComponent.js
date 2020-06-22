class ProjectileComponent extends Component {

    constructor(entityID, maxBounces, maxPenetrationDepth) {

        super(entityID);

        this.maxBounces = maxBounces;
        this.currBounces = 0;
        this.maxPenetrationDepth = maxPenetrationDepth;  // max number of enemies we can pass through
        this.currPenetrationDepth = 0;

    }

}