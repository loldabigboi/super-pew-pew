class LoopCallbackSystem extends System {

    constructor() {
        super([LoopCallbackComponent]);
    }
    
    update(dt, entities, scene) {

        for (const entityID of Object.keys(this.entities)) {
            const c = this.entities[entityID];
            c[LoopCallbackComponent].forEach((callbackC) => {
                callbackC.currLoops++;
                if (callbackC.currLoops >= callbackC.loopsBetween) {
                    callbackC.currLoops = callbackC.currLoops % callbackC.loopsBetween;
                    callbackC.callback({
                        id: entityID,
                        components: c,
                        dt: dt,
                        scene: scene
                    });
                } 
            });
        }

    }

}