class BasicEnemyFactory {

    static createEnemy(entityID, position, speed, size, health, gravityScale) {

        const g = ShapeComponent.GROUPS;

        const renComp = new RenderComponent(entityID, 'red', 'red', GameScene.ENEMY_LAYER);
        const  aiComp = new BasicEnemyAIComponent(entityID);
        const shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: size, height: size}, [0,0], [0,0], 0, 
            ShapeComponent.GROUPS.ENEMY, ShapeComponent.MASKS.ENEMY, 0, GameScene.CHARACTER_MATERIAL);
        const phyComp = new PhysicsComponent(entityID, {mass: 1, gravityScale: gravityScale, velocity: [speed, 0], position: position, damping: 0, fixedRotation: true}, [shapeComp]);
        const healthComp = new HealthComponent(entityID, health);
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