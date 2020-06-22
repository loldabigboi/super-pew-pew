class HealthComponent extends Component {

    constructor(entityID, maxHealth, onDeathCallback) {

        super(entityID);
        this.maxHealth = maxHealth;
        this.currHealth = maxHealth;
        this.onDeath = onDeathCallback;

    }

}