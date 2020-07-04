class ProjectileWeaponSystem extends System {

    constructor() {
        super([TransformComponent, WeaponComponent, ProjectileWeaponComponent]);
        this.fireRequests = [];  // requests to fire a weapon
    }

    /**
     * For semi-auto weapons, this requests a single fire. For automatic, this toggles shooting on/off.
     * @param {*} event 
     */
    receiveEvent(event) {
        if (event.type === ProjectileWeaponSystem.FIRE_WEAPON_EVENT) {
            this.fireRequests.push(event);
        }   
    }

    deleteEntity(id) {
        super.deleteEntity(id);
        this.fireRequests = this.fireRequests.filter(req => req.recipientID != id);
    }

    update(dt, entities, scene) {

        const entityEvents = [];

        const now = Date.now();
        while (this.fireRequests.length > 0) {

            const evt = this.fireRequests.shift();
            const entityID = evt.recipientID;

            let c = this.entities[entityID];
            let transC = c[TransformComponent];
            let weapC = c[WeaponComponent];
            let shapeC = c[ShapeComponent];
            let projWeapC = c[ProjectileWeaponComponent];

            if (!(now - weapC.lastUsed > weapC.useCooldown)) {
                continue;
            } else {
                weapC.lastUsed = now;
            }
            
            let startingPos = ParentComponent.getAbsolutePosition(entityID, entities);

            if (shapeC) {
                
                let relStartingPos = [0,0];
                const shape = shapeC.shape;
                if (shapeC.type === p2.Shape.BOX) {
                    relStartingPos = [ shape.width/2 * (1 - shapeC.propOffset[0]),
                                       0 * (1 - shapeC.propOffset[1]) ];
                } else if (shapeC.type === p2.Shape.CIRCLE) {
                    relStartingPos = [ shape.radius * (1 - shapeC.propOffset[0]),
                                       shape.radius/2 * (1 - shapeC.propOffset[1]) ];
                }

                p2.vec2.rotate(relStartingPos, relStartingPos, transC.angle);
                p2.vec2.add(startingPos, startingPos, relStartingPos);

            }

            const groups = ShapeComponent.GROUPS,
                  masks = ShapeComponent.MASKS;

            weapC.onUse({
                id: entityID,
                scene: scene,
                components: c
            });

            for (let i = 0; i < weapC.attCount; i++) {
                StatsManager.addShotFired();

                const componentsDict = {};
                const projID = Entity.GENERATE_ID();

                const vel = [projWeapC.pSpeed - projWeapC.pSpeedVariance/2 + projWeapC.pSpeedVariance*Math.random(), 0];
                const newAngle = transC.angle + Math.random() * projWeapC.angleVariance - projWeapC.angleVariance/2;
                const newVel = [];
                p2.vec2.rotate(newVel, vel, newAngle);

                const bodyObj = {
                    mass: 1, 
                    gravityScale: projWeapC.pGravityScale,
                    position: startingPos,
                    fixedRotation: false,
                    velocity: newVel,
                    damping: projWeapC.pDamping
                }

                const projShapeC = new ShapeComponent(projID, projWeapC.pShapeType, projWeapC.pShapeObj, [0, 0], [0, 0], 0, 
                                                      ShapeComponent.GROUPS.PROJ, ShapeComponent.MASKS.PROJ, groups.ENEMY, projWeapC.pMaterial);
                componentsDict[ShapeComponent] = projShapeC;
                componentsDict[PhysicsComponent] =  new PhysicsComponent(projID, bodyObj, [projShapeC]);
                componentsDict[PhysicsComponent].body.angle = newAngle;
                componentsDict[DelayedCallbackComponent] = [new DelayedCallbackComponent(projID, projWeapC.pLifetime, projWeapC.pCallbacks.onDeath)];
                componentsDict[ContactDamageComponent] = new ContactDamageComponent(projID, weapC.damage, Infinity, undefined, -1);
                componentsDict[ProjectileComponent] = new ProjectileComponent(projID, projWeapC.pMaxBounces, projWeapC.pCallbacks.onCreation, projWeapC.pCallbacks.onBounce,
                    projWeapC.pCallbacks.onDeath);
                componentsDict[HealthComponent] = new HealthComponent(projID, projWeapC.pPenetrationDepth, projWeapC.pCallbacks.onHit, projWeapC.pCallbacks.onDeath);
                componentsDict[RenderComponent] = new RenderComponent(projID, {
                    fill: {r:255,g:255,b:255},
                    shadowBlur: 5,
                    shadowColor: 'fill'
                }, GameScene.PROJ_LAYER);

                projWeapC.onFire({
                    id: entityID,
                    projID: projID,
                    components: componentsDict,
                    scene: scene
                });

                entityEvents.push(new TransmittedEvent(null, projID, null, Scene.ADD_ENTITY_EVENT, {
                    components: componentsDict
                }));

            }

        }

        return entityEvents; 

    }

}
ProjectileWeaponSystem.FIRE_WEAPON_EVENT = "fire_weapon";