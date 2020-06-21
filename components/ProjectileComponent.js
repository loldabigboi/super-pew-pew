class ProjectileComponent extends Component {

    constructor(entityID, maxBounces, penetrationDepth, lifetime, damage) {

        super(entityID);

        this.maxBounces = maxBounces;
        this.currBounces = 0;
        this.penetrationDepth = penetrationDepth;  // number of enemies we can pass through
        this.lifetime = lifetime;
        this.spawnTime = Date.now();
        this.damage = damage;

    }

}