class Callbacks{}

Callbacks.DELETE_ENTITY = (id, scene) => {
    scene.addEvent(new TransmittedEvent(null, null, null, Scene.DELETE_ENTITY_EVENT, {id: id}));
}