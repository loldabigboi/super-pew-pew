class System {

    constructor(requiredComponents) {
        
        this.entities = {}  // stores components according to entity id
        this.requiredComponents = requiredComponents;

    }

    addEntity(id, components) {

        for (const c of this.requiredComponents) {
            if (!components[c]) {
                //console.log("Required component '" + c.name + "' not included for '" + this.constructor.name + "'.");
                return false;  // entity not added
            }
        }

        this.entities[id] = components;
        return true;  // entity added

    }

    receiveEvent(event) {
    }

    update(dt, entities) {
    }

}
