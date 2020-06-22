class LifetimeComponent extends Component {

    constructor(entityID, lifetime, onDeathCallback) {

        super(entityID);
        this.lifetime = lifetime;
        this.spawnTime = Date.now();
        this.onDeath = onDeathCallback;

    }

}