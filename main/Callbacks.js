class Callbacks{}

Callbacks.DELETE_ENTITY = (obj) => {
    obj.scene.addEvent(new TransmittedEvent(null, obj.id, null, Scene.DELETE_ENTITY_EVENT));
}