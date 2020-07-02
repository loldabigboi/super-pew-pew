class Scene {

    constructor(game) {

        this.game = game;

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
        this.eventQueue = [];

        // stores all entities that will be deleted during next event queue processing
        this.deletionQueue = [];  

        // callbacks for different stages in an entity's life ('preDeletion' / 'postDeletion')
        this.entityCallbacks = {};

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
        this.entityCallbacks[id] = {};
        for (const system of Object.values(this.systemsDict)) {
            system.addEntity(id, components, this.entities);
        }
    }

    deleteEntity(id) {

        if (!this.entities[id]) {
            return;  // duplicate deletion calls can sometimes happen
        }

        const c = this.entities[id];

        if (this.entityCallbacks[id]['preDeletion']) {
            this.entityCallbacks[id]['preDeletion'].forEach((callback) => callback({
                id: id,
                scene: scene,
                components: c
            }));
        }
        

        for (const system of Object.values(this.systemsDict)) {
            system.deleteEntity(id, this);
        }
        delete this.entities[id];

        if (this.entityCallbacks[id]['postDeletion']) {
            this.entityCallbacks[id]['postDeletion'].forEach((callback) => callback({
                id: id,
                scene: this,
                components: c
            }));
        }
        this.entityCallbacks[id] = undefined;

    }

    addEntityCallback(id, type, callback) {
        if (!this.entities[id]) {
            return false;
        }
        this.entityCallbacks[id][type] = this.entityCallbacks[id][type] || [];
        this.entityCallbacks[id][type].push(callback);
    }

    addEvent(event) {
        if (event.recipientID != undefined && 
            event.type != Scene.ADD_ENTITY_EVENT && 
            !this.entities[event.recipientID]) {  // no entity to send event to
            return;
        }
        if (event.type == Scene.DELETE_ENTITY_EVENT) {
            this.deletionQueue.push(event.recipientID);
        }
        this.eventQueue.push(event);
    }

    updateSystems(dt) {

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

    }

    processEvents(dt) {

        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();  // treat like a queue
            if (!event.targetSystem) {  // event to be processed by scene
                if (event.type == Scene.ADD_ENTITY_EVENT) {
                    this.addEntity(event.recipientID, event.obj.components);
                } else if (event.type == Scene.DELETE_ENTITY_EVENT) {
                    this.deleteEntity(event.recipientID);
                }
            } else {
                this.systemsDict[event.targetSystem].receiveEvent(event);
            }
        }  
        this.deletionQueue = [];
        // while (this.deletionQueue.length > 0) {
        //     const id = this.deletionQueue.shift();  // treat like a queue
        //     this.deleteEntity(id);
        // }

    }

    update(dt) {

        this.updateSystems(dt);
        this.processEvents(dt);

    }
        
}
Scene.ADD_ENTITY_EVENT = "add_entity";
Scene.DELETE_ENTITY_EVENT = "delete_entity";

