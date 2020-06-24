class BasicEnemyFactory {

    static createEnemy(entityID, position, speed, size, health, gravityScale) {

        const g = ShapeComponent.GROUPS;

        const renComp = new RenderComponent(entityID, 'red', 'red', GameScene.ENEMY_LAYER);
        const  aiComp = new BasicEnemyAIComponent(entityID, speed);
        const shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: size, height: size}, [0,0], [0,0], 0, 
            ShapeComponent.GROUPS.ENEMY, ShapeComponent.MASKS.ENEMY, 0, GameScene.CHARACTER_MATERIAL);
        const phyComp = new PhysicsComponent(entityID, {mass: 1, gravityScale: gravityScale, velocity: [speed, 0], position: position, damping: 0, fixedRotation: true}, [shapeComp]);
        const healthComp = new HealthComponent(entityID, health, undefined, (obj) => {
            
            Callbacks.DELETE_ENTITY(obj);

            const c = obj.components;

            obj.scene.addEntityCallback(entityID, 'postDeletion', () => {
                delete c[ContactDamageComponent];
                delete c[HealthComponent];
                delete c[BasicEnemyAIComponent];
                c[LifetimeComponent] = new LifetimeComponent(entityID, 1000);
                //c[PhysicsComponent].body.collisionResponse = false;
                c[PhysicsComponent].body.fixedRotation = false;
                const newVel = [0, -25];
                p2.vec2.rotate(c[PhysicsComponent].body.velocity, newVel, -Math.PI/3 + Math.random()*Math.PI*2/3);
                c[PhysicsComponent].body.angularVelocity = Math.random() > 0.5 ? 0.75 : -0.75;
                c[PhysicsComponent].body.gravityScale = 1;
                c[PhysicsComponent].body.shapes[0].collisionMask = 0;
                c[LoopCallbackComponent] = [new LoopCallbackComponent(entityID, () => {
                    c[RenderComponent].opacity = Math.max(0, c[RenderComponent].opacity - 0.02);
                })]
                obj.scene.addEvent(new TransmittedEvent(null, entityID, null, Scene.ADD_ENTITY_EVENT, {
                    components: c
                }));
            });
            

        });
        const contactComp = new ContactDamageComponent(entityID, 1, Infinity, undefined, -1);
        const componentsDict = {};
        componentsDict[RenderComponent] = renComp;
        componentsDict[HealthComponent] = healthComp;
        componentsDict[ContactDamageComponent] = contactComp;
        componentsDict[BasicEnemyAIComponent] = aiComp;
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;

        return componentsDict

    }

}