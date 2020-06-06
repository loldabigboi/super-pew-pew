class System {

    constructor(acceptedComponentTypes) {
        
        this.entities = {}  // stores components according to entity id
        this.acceptedComponentTypes = acceptedComponentTypes;
        this.addComponentCallback = (component) => {this.entities[component.entityID].push(component);}

    }

    addComponents() {

        for (const component in arguments) {

            if (!this.acceptedComponentTypes.includes(component.constructor.name)) {
                throw Error("invalid component type");
            }
            this.addComponentCallback(component);

        }

    }

    update(dt) {
    }

}