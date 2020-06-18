class ProjectileWeaponComponent extends Component {

    constructor(entityID, angleVariance, speed, fireDelay, semiAuto, damage, maxBounces, penetrationDepth, gravityScale) {
        super(entityID);

        this.angleVariance = angleVariance;
        this.speed = speed;
        this.fireDelay = fireDelay;
        this.semiAuto = semiAuto;
        this.damage = damage;
        this.maxBounces = maxBounces;
        this.penetrationDepth = penetrationDepth;  // max number of enemies that this projectile can pass through
        this.gravityScale = gravityScale;  // 0 for no grav, 1 for norm. grav

    }

}