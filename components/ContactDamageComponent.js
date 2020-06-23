class ContactDamageComponent extends Component {

    constructor(entityID, damage, tickInterval, damageableIDs, mask, onHit) {

        super(entityID);

        this.damage = damage;
        this.damageableIDs = damageableIDs;  // ids of entities we can damage. if this is undefined / null, we can damage any entity (empty list can be used to temporarily disable damage)
        this.hasDamaged = {};  // stores ids of entities that have been damaged by this entity this update
        this.tickInterval = tickInterval;  // time between damage ticks on the same entity
        this.mask = mask; // used to determine what types of other entities we can damage

        // called when we 'hurt' another entity
        this.onHit = onHit || function(){};
    }

}