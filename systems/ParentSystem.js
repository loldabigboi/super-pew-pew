class ParentSystem extends System {

    constructor() {
        super([ParentComponent, TransformComponent]);
    }

    deleteEntity(id, scene) {

        super.deleteEntity(id);
        for (const entityID of Object.keys(this.entities)) {
            const c = this.entities[entityID];
            if (c[ParentComponent].parentID == id) {
                c[ParentComponent].onParentDeletion({
                    id: entityID,
                    scene: scene,
                    components: c
                });
            }
        }

    }

}