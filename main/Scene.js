class Scene {

    constructor() {

        // use dict to store systems so we can ahve 'layers' (certain systems run b4 other ones)
        this.systems = {

        }
        this.entities = {};

    }

    addSystem(system, _priority) {

        const priority = _priority | 100;  //  default to v. low priority

        if (this.systems[priority] != undefined) {
            this.systems[priorty].push(system);
        } else {  // init system array
            this.systems[priority] = [system];
        }

    }

    addEntity(id, components) {
        this.entities[id] = components;
        for (const p of Object.keys(this.systems)) {
            for (const system of this.systems[p]) {
                system.addEntity(id, components);
            }
        }
    }

    update(dt) {

        for (const p of Object.keys(this.systems).sort()) {
            const systems = this.systems[p];
            for (const system of systems) {
                system.update(dt, this.entities);
            }
        }

    }
        
}

