class Scene {

    constructor() {

        // store systems by priority so we can have 'layers' (certain systems run b4 other ones)
        this.priorityDict = {

        }

        // used to store systems by class, to make transmission of events more efficient
        this.sytemsDict = {

        }
        this.entities = {};

    }

    addSystem(system, _priority) {

        const priority = _priority | 100;  //  default to v. low priority

        this.sytemsDict[system.constructor] = system;
        if (this.priorityDict[priority] != undefined) {
            this.priorityDict[priorty].push(system);
        } else {  // init system array
            this.priorityDict[priority] = [system];
        }

    }

    addEntity(id, components) {
        this.entities[id] = components;
        for (const p of Object.keys(this.priorityDict)) {
            for (const system of this.priorityDict[p]) {
                system.addEntity(id, components);
            }
        }
    }

    update(dt) {

        for (const p of Object.keys(this.priorityDict).sort()) {
            const systems = this.priorityDict[p];
            for (const system of systems) {
                system.update(dt, this.entities);
            }
        }

    }
        
}

