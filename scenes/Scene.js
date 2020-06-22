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

        // stores all events to be processed at the end of next update (excl. deletion events as these are handled differently)
        this.mainEventQueue = [];

        // stores all entities to be deleted after next systems update
        this.deletionQueue = [];  

        // callbacks for when an entity is deleted
        this.deletionCallbacks = {};

    }

    addSystem(system, _priority) {

        const priority = _priority || 100;  //  default to v. low priority

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
        this.deletionCallbacks[id] = [];
        for (const system of Object.values(this.systemsDict)) {
            system.addEntity(id, components);
        }
    }

    deleteEntity(id) {

        if (!this.entities[id]) {
            return;  // duplicate deletion calls can sometimes happen
        }

        for (const system of Object.values(this.systemsDict)) {
            system.deleteEntity(id, this);
        }
        this.deletionCallbacks[id].forEach((fn) => {
            fn(id, this);
        });
        this.deletionCallbacks[id] = undefined;
        delete this.entities[id];

    }

    addDeletionCallback(id, callback) {
        this.deletionCallbacks[id].push(callback);
    }

    addEvent(event) {
        if (event.type == Scene.DELETE_ENTITY_EVENT) {
            this.deletionQueue.push(event.obj.id);
        } else {
            this.mainEventQueue.push(event);
        }
    }

    update(dt) {

        for (const p of Object.keys(this.priorityDict).sort()) {
            const systems = this.priorityDict[p];
            for (const system of systems) {
                // not every system has to return events
                const events = system.update(dt, this.entities, this) || [];
                
                for (const event of events) {
                    this.addEvent(event);
                }
            }
        }

        while (this.mainEventQueue.length > 0) {
            const event = this.mainEventQueue.shift();  // treat like a queue
            if (!event.targetSystem) {  // event to be processed by scene
                if (event.type == Scene.ADD_ENTITY_EVENT) {
                    this.addEntity(event.obj.id, event.obj.components);
                }
            } else {
                this.systemsDict[event.targetSystem].receiveEvent(event);
            }
        }  

        while (this.deletionQueue.length > 0) {
            const id = this.deletionQueue.shift();  // treat like a queue
            this.deleteEntity(id);
        }

    }
        
}
Scene.ADD_ENTITY_EVENT = "add_entity";
Scene.DELETE_ENTITY_EVENT = "delete_entity";

