class RepeatingCallbackSystem extends System {

    constructor() {
        super([RepeatingCallbackComponent]);
    }

    update(dt, entities, scene) {

        const now = Date.now();
        for (const entityID of Object.keys(this.entities)) {
            const c = this.entities[entityID];
            const repCArr = c[RepeatingCallbackComponent];

            for (const repC of repCArr) {
                if (now - repC.lastCalled > repC.interval) {
                    repC.lastCalled = now;
                    repC.callback({
                        id: entityID,
                        components: c,
                        scene: scene
                    })
                }
            }

        }

    }

}