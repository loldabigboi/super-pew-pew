class ProjectileWeaponComponent {

    constructor(entityID, angleVariance, projectileSpeed, fireDelay, semiAuto) {
        super(entityID);

        this.angleVariance = angleVariance;
        this.projectileSpeed = projectileSpeed,
        this.fireDelay = fireDelay;
        this.semiAuto = semiAuto;
    }

}