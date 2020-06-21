class WeaponComponent extends Component {

    constructor(entityID, attCount, useDelay, semiAuto, damage) {
        super(entityID);

        this.attCount = attCount;  // attacks per use (e.g. bullets per fire, like a shotgun will have 8 or something)
        this.lastUsed = 0;
        this.useDelay = useDelay;
        this.semiAuto = semiAuto;
        this.damage = damage;
    }

}