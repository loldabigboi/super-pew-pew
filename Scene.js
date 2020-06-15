class Scene {

    constructor() {

        // use dict to store systems so we can ahve 'layers' (certain systems run b4 other ones)
        this.systems = {

        }

    }

    addSystem(system, _priority) {

        const priority = _priority | 100;  //  default to v. low priority

        if (this.systems[priority] != undefined) {
            this.systems[priorty].push(system);
        } else {  // init system array
            this.systems[priority] = [system];
        }

    }

    update(dt) {

    }
        
}