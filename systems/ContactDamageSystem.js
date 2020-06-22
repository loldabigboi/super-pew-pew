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
                damageBody: damageBody,
                otherBody: otherBody
            });

        });
    }

    update(dt, entities, scene) {

        const prevDamaged = {}
        for (const entityID of Object.keys(this.entities)) {
            // store and reset damage registers
            prevDamaged[entityID] = this.entities[entityID][ContactDamageComponent].hasDamaged;
            this.entities[entityID][ContactDamageComponent].hasDamaged = {};
        }

        const now = Date.now();

        for (const collision of this.collisions) {
            
            const entityID = collision.damageBody.id,
                  otherID = collision.otherBody.id;

            const c = this.entities[entityID],
                  otherC = entities[otherID];

            const dmgC = c[ContactDamageComponent];
            const healthC = otherC[HealthComponent];

            if (healthC) {
                const prevDamagedObj = prevDamaged[entityID][otherID];
                let tick = false;
                if (!dmgC.damageableIDs || dmgC.damageableIDs.includes(otherID)) {
                    if (prevDamagedObj) {
                        const last = prevDamagedObj.time;
                        if (prevDamagedObj.tickInterval == Infinity) {  // only hits upon first contact
    
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
                    healthC.currHealth -= dmgC.damage;
                    if (healthC.currHealth <= 0) {
                        healthC.onDeath(otherID, scene);
                    }
                }

            }

        }
        this.collisions = [];

    }

}