class PlatformFactory {

    static createPlatform(entityID, w, h, position, angle) {

        const groups = ShapeComponent.GROUPS,
              masks  = ShapeComponent.MASKS;

        let shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, 0, GameScene.OBSTACLE_MATERIAL)
        let phyComp = new PhysicsComponent(entityID, {position: position, angle: angle}, [shapeComp]);
        let renComp = new RenderComponent(entityID, 'white', 'blue', 1, GameScene.GROUND_LAYER);

        let componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[RenderComponent] = renComp;
        componentsDict[PhysicsComponent] = phyComp;
        return componentsDict;

    }

}