class ContactDamageSystem extends System {

    constructor(world) {
        super([ContactDamageComponent, PhysicsComponent]);
        this.collisions = [];
        world.on('beginContact', (evt) => {

            let damageBody, otherBody;
            if (this.entities[evt.bodyA.id]) {
                damageBody = evt.bodyA;
                otherBody = evt.bodyB;
            } else if (this.entities[evt.bodyB.id]) {
                damageBody = evt.bodyB;
                otherBody = evt.bodyA;
            } else {
                return;
            }

            this.collisions.push({
                damageID: damageBody.id,
                otherID: otherBody.id
            });

        });
    }

    deleteEntity(id) {
        super.deleteEntity(id);
        this.collisions = this.collisions.filter((c) => c.damageID != id && c.otherID != id);
    }

    update(dt, entities, scene) {

        const prevDamaged = {}
        for (const entityID of Object.keys(this.entities)) {
            // store and reset damage registers
            prevDamaged[entityID] = this.entities[entityID][ContactDamageComponent].hasDamaged;
            this.entities[entityID][ContactDamageComponent].hasDamaged = {};
        }


        for (const collision of this.collisions) {
            
            this.resolveCollision(collision.damageID, collision.otherID, prevDamaged, entities, scene);
            if (this.entities[collision.otherID]) {  // if both entities have contact damage then we also need to check the reverse, as only one collision is generated per pair of entities
                this.resolveCollision(collision.otherID, collision.damageID, prevDamaged, entities, scene);
            }

        }
        this.collisions = [];

    }

    resolveCollision(damageID, otherID, prevDamaged, entities, scene) {

        const now = Date.now();

        const c = this.entities[damageID],
              otherC = entities[otherID];

        const dmgC = c[ContactDamageComponent];
        const healthC = otherC[HealthComponent];
        const healthShape = otherC[ShapeComponent];

        if (healthC) {
            const prevDamagedObj = prevDamaged[damageID][otherID];
            let tick = false;
            if ((!dmgC.damageableIDs || dmgC.damageableIDs.includes(otherID)) && (dmgC.mask & healthShape.shape.collisionGroup)) {
                if (prevDamagedObj) {
                    const last = prevDamagedObj.time;
                    if (dmgC.tickInterval == Infinity) {  // only hits upon first contact

                        tick = true;
                        dmgC.hasDamaged[otherID] = {
                            time: now,
                            ticks: 1
                        }

                    } else if (now - last > dmgC.tickInterval) {

                        tick = true;
                        dmgC.hasDamaged[otherID] = {
                            time: now,
                            ticks: prevDamagedObj.ticks++
                        }

                    } else {
                        dmgC.hasDamaged[otherID] = prevDamagedObj;
                    }
                } else {
                    tick = true;
                    dmgC.hasDamaged[otherID] = {
                        time: Date.now(),
                        ticks: 1
                    } 
                }
            } 

            if (tick) {
                dmgC.onHit(damageID, otherID, scene);
                healthC.currHealth -= dmgC.damage;
                healthC.onHit({
                    id: otherID, 
                    otherID: damageID, 
                    scene: scene,
                    components: otherC
                });
                if (healthC.currHealth <= 0) {
                    healthC.onDeath({
                        id: otherID, 
                        otherID: damageID,
                        scene: scene,
                        components: otherC
                    });
                }
            }

        }

    }

}