class ProjectileComponent extends Component {

    constructor(entityID, maxBounces) {

        super(entityID);

        this.maxBounces = maxBounces;
        this.currBounces = 0;

    }

}