class ContactDamageComponent extends Component {

    constructor(entityID, damage, damageInterval, damageIDs) {

        super(entityID);
        this.damage = damage;
        this.damageIDs = damageIDs;  // ids of entities we can damage. if this is undefined / null, we can damage any entity (empty list can be used to temporarily disable damage)
        this.hasDamaged = {};  // stores ids of entities that have been damaged by this entity this update
        this.damageInterval = damageInterval;  // time between damage ticks on the same entity

    }

}