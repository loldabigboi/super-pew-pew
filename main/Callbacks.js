class Callbacks{}

Callbacks.DELETE_ENTITY = (id, scene) => {
    console.log(Date.now());
    scene.addEvent(new TransmittedEvent(null, null, null, Scene.DELETE_ENTITY_EVENT, {id: id}));
    console.log(scene.deletionQueue);
}