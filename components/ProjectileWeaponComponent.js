class ProjectileWeaponComponent extends Component {

    constructor(entityID, angleVariance, speed, maxBounces, penetrationDepth, gravityScale, friction, material) {
        super(entityID);

        this.angleVariance = angleVariance;
        this.speed = speed;
        this.maxBounces = maxBounces;
        this.penetrationDepth = penetrationDepth;  // max number of enemies that this projectile can pass through
        this.gravityScale = gravityScale;  // 0 for no grav, 1 for norm. grav
        this.friction = friction;  // air friction co-efficient
        this.material = material;
    }

}