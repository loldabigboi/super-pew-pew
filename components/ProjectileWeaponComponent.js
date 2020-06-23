class ProjectileWeaponComponent extends Component {

    constructor(entityID, angleVariance, pSpeed, pMaxBounces, pPenetrationDepth, pLifetime, pGravityScale, pDamping, pMaterial) {
        super(entityID);

        this.angleVariance = angleVariance;
        this.pSpeed = pSpeed;
        this.pMaxBounces = pMaxBounces;
        this.pPenetrationDepth = pPenetrationDepth;  // max number of enemies that this projectile can pass through
        this.pLifetime = pLifetime;
        this.pGravityScale = pGravityScale;  // 0 for no grav, 1 for norm. grav
        this.pDamping = pDamping;  // air friction co-efficient
        this.pMaterial = pMaterial;
        
    }

}

ProjectileWeaponComponent.BULLET_MATERIAL = new p2.Material();