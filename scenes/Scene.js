class Scene {

    constructor() {

        // store systems by priority so we can have 'layers' (certain systems run b4 other ones)
        this.priorityDict = {
        }

        // used to store systems by class, to make transmission of events more efficient
        this.systemsDict = {
        }

        // stores all entities that have been added to this scene
        // is passed to each system in case they need to access entities not in their system (e.g. for tracking system)
        this.entities = {};

    }

    addSystem(system, _priority) {

        const priority = _priority | 100;  //  default to v. low priority

        this.systemsDict[system.constructor] = system;
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
                // not every system has to return events
                const events = system.update(dt, this.entities) || [];
                for (const event of events) {
                    if (!event.targetSystem) {  // event to be processed by scene
                        if (event.type == Scene.ADD_ENTITY_EVENT) {  // might be moved in future if adding entities during system updates causes issues
                            this.addEntity(event.obj.id, event.obj.components);
                        }
                    }
                    this.systemsDict[event.targetSystem].receiveEvent(event);
                }
            }
        }

    }
        
}
Scene.ADD_ENTITY_EVENT = "add_entity";

