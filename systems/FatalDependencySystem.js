class FatalDependencySystem extends System {

    constructor() {
        super([FatalDependencyComponent])
    }

    update(dt, entities, scene) {
        const events = [];
        for (const entityID of Object.keys(this.entities)) {
            const dependencyID = this.entities[entityID][FatalDependencyComponent].dependencyID
            if (scene.deletionQueue.includes(dependencyID)) {
                events.push(new TransmittedEvent(null, null, null, Scene.DELETE_ENTITY_EVENT, {id: entityID}));
            }
        }
        return events;
    }

}