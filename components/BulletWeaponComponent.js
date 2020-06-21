class BulletWeaponComponent extends Component {

    constructor(entityID, size) {

        super(entityID);
        this.size = size;

    }

}

BulletWeaponComponent.PISTOL = function(entityID) {

    const compDict = {};
    compDict[WeaponComponent] = new WeaponComponent(entityID, 1, 100, true, 1);
    compDict[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.03, 150, 2, 1, 3000, 0, 0, BulletWeaponComponent.MATERIAL);
    compDict[BulletWeaponComponent] = new BulletWeaponComponent(entityID, 6);
    return compDict;
    
}

BulletWeaponComponent.MATERIAL = new p2.Material();