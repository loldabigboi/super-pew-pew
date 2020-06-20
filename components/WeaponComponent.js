class WeaponComponent extends Component {

    constructor(entityID, count, useDelay, semiAuto, damage) {
        super(entityID);

        this.count = count;
        this.lastUsed = 0;
        this.useDelay = useDelay;
        this.semiAuto = semiAuto;
        this.damage = damage;
    }

}