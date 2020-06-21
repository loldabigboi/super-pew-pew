class ProjectileComponent extends Component {

    constructor(entityID, maxBounces, maxPenetrationDepth, lifetime, damage) {

        super(entityID);

        this.maxBounces = maxBounces;
        this.currBounces = 0;
        this.maxPenetrationDepth = maxPenetrationDepth;  // max number of enemies we can pass through
        this.currPenetrationDepth = 0;
        this.lifetime = lifetime;
        this.spawnTime = Date.now();
        this.damage = damage;

    }

}