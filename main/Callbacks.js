class Callbacks{}

Callbacks.DELETE_ENTITY = (id, scene) => {
    scene.addEvent(new TransmittedEvent(null, id, null, Scene.DELETE_ENTITY_EVENT));
}