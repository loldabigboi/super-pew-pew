class LifetimeComponent extends Component {

    constructor(entityID, lifetime, onDeathCallback) {

        super(entityID);
        this.lifetime = lifetime;
        this.spawnTime = Date.now();
        this.onDeath = onDeathCallback;

    }

}

LifetimeComponent.DELETE_CALLBACK = (id, scene) => {
    console.log(id);
    scene.addEvent(new TransmittedEvent(null,null,null,Scene.DELETE_ENTITY_EVENT,{id: id}));
}