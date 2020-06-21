class ProjectileWeaponSystem extends System {

    constructor() {
        super([TransformComponent, WeaponComponent, ProjectileWeaponComponent]);
        this.fireRequests = [];  // requests to fire a weapon
    }

    receiveEvent(event) {
        if (event.type === ProjectileWeaponSystem.FIRE_WEAPON_EVENT) {
            this.fireRequests.push(event);
        }   
    }

    update(dt, entities) {

        const entityEvents = [];
        for (const request of this.fireRequests) {

            console.log(this.entities);

            let c = this.entities[request.recipientID];
            let transC = c[TransformComponent];
            let weapC = c[WeaponComponent];
            let shapeC = c[ShapeComponent];
            let projWeapC = c[ProjectileWeaponComponent];
            
            let startingPos = transC.position;

            if (shapeC) {
                
                let relStartingPos = [0,0];
                const shape = shapeC.shape;
                if (shapeC.type === p2.Shape.BOX) {
                    relStartingPos = [ shape.width * (1 - shapeC.propOffset[0]),
                                       shape.height/2 * (1 - shapeC.propOffset[1]) ];
                } else if (shapeC.type === p2.Shape.CIRCLE) {
                    relStartingPos = [ shape.radius * (1 - shapeC.propOffset[0]),
                                       shape.radius/2 * (1 - shapeC.propOffset[1]) ];
                }

                let newRelStartingPos = [];
                newRelStartingPos[0] = Math.cos(transC.angle)*relStartingPos[0] - Math.sin(transC.angle)*relStartingPos[1];
                newRelStartingPos[1] = Math.sin(transC.angle)*relStartingPos[0] + Math.cos(transC.angle)*relStartingPos[1];
                            
                startingPos = [ transC.position[0] + newRelStartingPos[0],
                                transC.position[1] + newRelStartingPos[1] ];
            }

            

            for (let i = 0; i < weapC.attCount; i++) {
                const componentsDict = {};
                const entityID = Entity.GENERATE_ID();

                const vel = [projWeapC.pSpeed, 0];
                const newAngle = transC.angle + Math.random() * projWeapC.angleVariance;
                const newVel = [];
                newVel[0] = Math.cos(newAngle)*vel[0] - Math.sin(newAngle)*vel[1];
                newVel[1] = Math.sin(newAngle)*vel[0] + Math.cos(newAngle)*vel[1];

                const bodyObj = {
                    mass: 1, 
                    gravityScale: projWeapC.pGravityScale,
                    position: startingPos,
                    fixedRotation: false,
                    velocity: newVel,
                    damping: projWeapC.pDamping
                }

                let shapeObj = {};
                if (c[BulletWeaponComponent]) {
                    shapeObj.radius = c[BulletWeaponComponent].size
                } else {
                    throw new Error("Only BulletWeaponComponent is currently supported for projectile weapons");
                }
                const projShapeC = new ShapeComponent(entityID, p2.Shape.CIRCLE, shapeObj, [0, 0], [0, 0], 0, 
                                                      ShapeComponent.GROUPS.PROJ, ShapeComponent.MASKS.PROJ, BulletWeaponComponent.MATERIAL);
                componentsDict[ShapeComponent] = projShapeC;
                componentsDict[PhysicsComponent] =  new PhysicsComponent(entityID, bodyObj, [projShapeC]);
                componentsDict[ProjectileComponent] = new ProjectileComponent(entityID, projWeapC.pMaxBounces, projWeapC.pPenetrationDepth, projWeapC.pLifetime, weapC.damage);;
                componentsDict[RenderComponent] = new RenderComponent(entityID, 'black', 'black');

                entityEvents.push(new TransmittedEvent(entityID, null, null, Scene.ADD_ENTITY_EVENT, {
                    id: entityID,
                    components: componentsDict
                }));

            }

        }

        this.fireRequests = [];  // reset fire requests list
        return entityEvents; 

    }

}
ProjectileWeaponSystem.FIRE_WEAPON_EVENT = "fire_weapon";