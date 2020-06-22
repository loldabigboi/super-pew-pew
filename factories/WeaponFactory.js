class WeaponFactory {

    static createPistol(entityID, trackID) {

        const renComp = new RenderComponent(entityID, 'red', 'red', GameScene.WEAPON_LAYER);
        const shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: 20, height: 5}, [0, 0], ShapeComponent.CENTER_LEFT, 0);
        const transComp = new TransformComponent(entityID, [0, 0], 0);
        const trackComp = new TrackingComponent(entityID, trackID, ShapeComponent.CENTER, [0, 3], 1);
        const callbackComponent = new LoopCallbackComponent(entityID, (dt, components) => {
            const mousePos = [InputManager.mouse.x, InputManager.mouse.y];
            const gunPos = transComp.position;
            const vec = [mousePos[0] - gunPos[0], mousePos[1] - gunPos[1]];
            transComp.angle = Math.atan2(vec[1], vec[0]);
        });

        const componentsDict = {};
        componentsDict[RenderComponent] = renComp;
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[TransformComponent] = transComp;
        componentsDict[TrackingComponent] = trackComp;
        componentsDict[LoopCallbackComponent] = [callbackComponent];        
        componentsDict[WeaponComponent] = new WeaponComponent(entityID, 1, 100, true, 1);
        componentsDict[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.03, 150, 2, 1, 3000, 0, 0, ProjectileWeaponComponent.BULLET_MATERIAL);
        componentsDict[BulletWeaponComponent] = new BulletWeaponComponent(entityID, 6);
        return componentsDict;
            
    }

}