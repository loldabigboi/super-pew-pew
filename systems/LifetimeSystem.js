class LifetimeSystem extends System {

    constructor() {
        super([LifetimeComponent]);
    }

    update(dt, entities, scene) {

        const now = Date.now();
        for (const entityID of Object.keys(this.entities)) {

            const c = this.entities[entityID];
            const lifeC = c[LifetimeComponent];
            if (now - lifeC.spawnTime > lifeC.lifetime) {
                lifeC.onDeath({
                    id: entityID, 
                    scene: scene
                });
            }

        }

    }

}