class LoopCallbackSystem extends System {

    constructor() {
        super([LoopCallbackComponent]);
    }
    
    update(dt) {

        for (const entityID of Object.keys(this.entities)) {
            const c = this.entities[entityID];
            c[LoopCallbackComponent].forEach((callbackC) => {
                callbackC.callback(c, dt);
            });
        }

    }

}