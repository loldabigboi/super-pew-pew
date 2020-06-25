class ProjectileWeaponComponent extends Component {

    constructor(entityID, angleVariance, kickback, pSpeed, pSpeedVariance, pMaxBounces, pPenetrationDepth, pLifetime, pGravityScale, pDamping, pShapeType, pShapeObj, pMaterial, pCallbacks, onFire) {
        super(entityID);

        this.angleVariance = angleVariance;
        this.kickback = kickback;
        this.pSpeed = pSpeed;
        this.pSpeedVariance = pSpeedVariance;
        this.pMaxBounces = pMaxBounces;
        this.pPenetrationDepth = pPenetrationDepth;  // max number of enemies that this projectile can pass through
        this.pLifetime = pLifetime;
        this.pGravityScale = pGravityScale;  // 0 for no grav, 1 for norm. grav
        this.pDamping = pDamping;  // air friction co-efficient
        this.pShapeType = pShapeType;
        this.pShapeObj = pShapeObj;
        this.pMaterial = pMaterial;
        this.pCallbacks = pCallbacks || {};
        this.onFire = onFire || function(){};

    }

}

ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL = new p2.Material();
ProjectileWeaponComponent.LOSS_BOUNCE_MATERIAL = new p2.Material();