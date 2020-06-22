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

        // stores all events to be processed at the end of next update
        this.eventQueue = [];

    }

    addSystem(system, _priority) {

        const priority = _priority | 100;  //  default to v. low priority

        this.systemsDict[system.constructor] = system;
        if (this.priorityDict[priority] != undefined) {
            this.priorityDict[priority].push(system);
        } else {  // init system array
            this.priorityDict[priority] = [system];
        }

    }

    addEntity(id, components) {
        if (!components) {  // object passed in place of id
            components = id.components;
            id = id.id;
        }
        this.entities[id] = components;
        for (const system of Object.values(this.systemsDict)) {
            system.addEntity(id, components);
        }
    }

    deleteEntity(id) {

        for (const system of Object.values(this.systemsDict)) {
            const events = system.deleteEntity(id) || [];
            this.eventQueue = this.eventQueue.concat(events);
        }

    }

    addEvent(event) {
        if (event instanceof Array) {
            this.eventQueue = this.eventQueue.concat(event);
        } else {
            this.eventQueue.push(event);
            console.log(this.eventQueue);
        }
    }

    update(dt) {

        for (const p of Object.keys(this.priorityDict).sort()) {
            const systems = this.priorityDict[p];
            for (const system of systems) {
                // not every system has to return events
                const events = system.update(dt, this.entities, this) || [];
                this.eventQueue = this.eventQueue.concat(events);
            }
        }

        const deleteEvents = [];
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();  // treat like a queue
            if (!event.targetSystem) {  // event to be processed by scene
                if (event.type == Scene.ADD_ENTITY_EVENT) {
                    this.addEntity(event.obj.id, event.obj.components);
                } else if (event.type == Scene.DELETE_ENTITY_EVENT) {  
                    deleteEvents.push(event);  // do delete events last to prevent bugs
                }
            } else {
                this.systemsDict[event.targetSystem].receiveEvent(event);
            }
        }
        

        deleteEvents.forEach((event) => {
            this.deleteEntity(event.obj.id);
        })

    }
        
}
Scene.ADD_ENTITY_EVENT = "add_entity";
Scene.DELETE_ENTITY_EVENT = "delete_entity";

