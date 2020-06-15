class Scene {

    constructor() {

        // use dict to store systems so we can ahve 'layers' (certain systems run b4 other ones)
        this.systems = {

        }

    }

    addSystem(system, _priority) {

        const priority = _priority | Scene.PRIORITY.MODERATE;

        if (this.systems[priority] != undefined) {
            this.systems[priorty].push(system);
        } else {  // init system array
            this.systems[priority] = [system];
        }

    }

    update(dt) {

    }
        
}
Scene.PRIORITY = {
    TOP = 0,
    VERY_HIGH = 1,
    HIGH = 2,
    MODERATE = 3,
    LOW = 4,
    VERY_LOW = 5,
    LOWEST = 6
}