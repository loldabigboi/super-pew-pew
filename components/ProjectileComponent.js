class ProjectileComponent extends Component {

    constructor(entityID, maxBounces, onCreation, onBounce, onDeath) {

        super(entityID);

        this.maxBounces = maxBounces;
        this.currBounces = 0;

        // callbacks that are called at various stages of the projectiles lifetime
        this.onCreation = onCreation || function(){};
        this.onBounce = onBounce || function(){};
        this.onDeath = onDeath || Callbacks.DELETE_ENTITY;

    }

}