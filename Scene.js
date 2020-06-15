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
    MAX = 0,
    V_HI = 1,
    HI = 2,
    MED = 3,
    LO = 4,
    V_LO = 5,
    MIN = 6
}