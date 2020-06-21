class BasicEnemyFactory {

    static createEnemy(speed, size, mass, material) {

        const entityID = Entity.GENERATE_ID();
        const renComp = new RenderComponent(entityID, 'red', 'red');
        const  aiComp = new BasicEnemyAIComponent(entityID, speed);
        const shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: size, height: size}, [0,0], [0,0], 0, 
            ShapeComponent.GROUPS.ENEMY, ShapeComponent.MASKS.ENEMY, material);
        const phyComp = new PhysicsComponent(entityID, {mass: mass, velocity: [speed, 0], position: [canvas.width/2, 50], damping: 0, fixedRotation: true}, [shapeComp]);
        const componentsDict = {};
        componentsDict[RenderComponent] = renComp;
        componentsDict[BasicEnemyAIComponent] = aiComp;
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[PhysicsComponent] = phyComp;

        return {
            id: entityID,
            components: componentsDict
        }

    }

}