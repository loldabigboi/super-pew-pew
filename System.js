class System {

    constructor(requiredComponents) {
        
        this.entities = {}  // stores components according to entity id
        this.requiredComponents = requiredComponents;

    }

    addEntity(id, components) {

        for (const c of this.requiredComponents) {
            if (!components.includes(c)) {
                throw new Error("Required component '" + c.constructor.name + "' not included.");
            }
        }

        this.entites[id] = components;

    }

    update(dt) {
    }

}