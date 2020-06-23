class LifetimeComponent extends Component {

    constructor(entityID, lifetime, onDeath) {

        super(entityID);
        this.lifetime = lifetime;
        this.spawnTime = Date.now();
        this.onDeath = onDeath || Callbacks.DELETE_ENTITY;

    }

}