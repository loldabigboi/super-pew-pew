class WeaponComponent extends Component {

    constructor(entityID, attCount, useCooldown, semiAuto, damage, onUse) {
        super(entityID);

        this.attCount = attCount;  // attacks per use (e.g. bullets per fire, like a shotgun will have 8 or something)
        this.lastUsed = 0;
        this.useCooldown = useCooldown;
        this.semiAuto = semiAuto;
        this.damage = damage;
        this.onUse = onUse || function(){};
    }

}