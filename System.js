class System {

    constructor() {
        
        this.entities = {}  // stores components according to entity id

    }

    addComponents() {

        for (const component in arguments) {

            if (!component instanceof Component) {
                throw Error("must be component");
            }

            this.entities[component.entityID].push(component);

        }

    }

    update(dt) {
    }

}