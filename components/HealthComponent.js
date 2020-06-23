class HealthComponent extends Component {

    constructor(entityID, maxHealth, onHit, onDeath) {

        super(entityID);
        this.maxHealth = maxHealth;
        this.currHealth = maxHealth;
        
        this.onHit = onHit || function(){};
        this.onDeath = onDeath || Callbacks.DELETE_ENTITY;

    }

}