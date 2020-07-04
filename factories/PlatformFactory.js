class PlatformFactory {

    static createPlatform(entityID, start, end) {

        const lineVec = p2.vec2.sub([], end, start);
        const len = p2.vec2.len(lineVec);
        const pos = p2.vec2.add([], start, p2.vec2.scale([], lineVec, 1/2));

        const groups = ShapeComponent.GROUPS,
              masks  = ShapeComponent.MASKS;

        let shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: len, height: 5}, [0,0], [0,0], 0, groups.GROUND, masks.GROUND, 0, GameScene.OBSTACLE_MATERIAL)
        let phyComp = new PhysicsComponent(entityID, {
            position: pos, 
            angle: Math.atan2(lineVec[1], lineVec[0])
        }, [shapeComp]);
        let renComp = new RenderComponent(entityID, {
            fill: {r:255,g:255,b:255},
            shadowBlur: 10,
            shadowColor: {r:255,g:255,b:255,a:0.5}
        }, GameScene.GROUND_LAYER);
        
        let componentsDict = {}
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[RenderComponent] = renComp;
        componentsDict[PhysicsComponent] = phyComp;
        return componentsDict;

    }

}