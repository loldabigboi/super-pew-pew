class WeaponFactory {

    static createPistol(entityID, trackID) {

        const renComp = new RenderComponent(entityID, 'red', 'red', GameScene.WEAPON_LAYER);
        const shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: 20, height: 5}, [0, 0], ShapeComponent.CENTER_LEFT, 0);
        const transComp = new TransformComponent(entityID, [0, 0], 0);
        const trackComp = new TrackingComponent(entityID, trackID, ShapeComponent.CENTER, [0, 3], 1);
        const fatalComp = new FatalDependencyComponent(entityID, trackID);
        

        const componentsDict = {};
        componentsDict[RenderComponent] = renComp;
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[TransformComponent] = transComp;
        componentsDict[TrackingComponent] = trackComp;
        componentsDict[FatalDependencyComponent] = fatalComp;
        componentsDict[WeaponComponent] = new WeaponComponent(entityID, 1, 75, true, 1);
        componentsDict[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.5, 125, 1, 1, 3000, 0, 0, ProjectileWeaponComponent.BULLET_MATERIAL);
        componentsDict[BulletWeaponComponent] = new BulletWeaponComponent(entityID, 6);
        return componentsDict;
            
    }

    static createMachineGun(entityID, trackID) {

        const renComp = new RenderComponent(entityID, 'orange', 'orange', GameScene.WEAPON_LAYER);
        const shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: 25, height: 5}, [0, 0], ShapeComponent.CENTER_LEFT, 0);
        const transComp = new TransformComponent(entityID, [0, 0], 0);
        const trackComp = new TrackingComponent(entityID, trackID, ShapeComponent.CENTER, [0, 3], 1);
        const fatalComp = new FatalDependencyComponent(entityID, trackID);
        

        const componentsDict = {};
        componentsDict[RenderComponent] = renComp;
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[TransformComponent] = transComp;
        componentsDict[TrackingComponent] = trackComp;
        componentsDict[FatalDependencyComponent] = fatalComp;
        componentsDict[WeaponComponent] = new WeaponComponent(entityID, 1, 50, false, 1);
        componentsDict[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.1, 125, 1, 1, 2500, 0, 0, ProjectileWeaponComponent.BULLET_MATERIAL);
        componentsDict[BulletWeaponComponent] = new BulletWeaponComponent(entityID, 6);
        return componentsDict;

    }

    static createMinigun(entityID, trackID) {

        const renComp = new RenderComponent(entityID, 'purple', 'purple', GameScene.WEAPON_LAYER);
        const shapeComp = new ShapeComponent(entityID, p2.Shape.BOX, {width: 30, height: 12}, [-6, 0], ShapeComponent.CENTER_LEFT, 0);
        const transComp = new TransformComponent(entityID, [0, 0], 0);
        const trackComp = new TrackingComponent(entityID, trackID, ShapeComponent.CENTER, [0, 3], 1);
        const fatalComp = new FatalDependencyComponent(entityID, trackID);
        

        const componentsDict = {};
        componentsDict[RenderComponent] = renComp;
        componentsDict[ShapeComponent] = shapeComp;
        componentsDict[TransformComponent] = transComp;
        componentsDict[TrackingComponent] = trackComp;
        componentsDict[FatalDependencyComponent] = fatalComp;
        componentsDict[WeaponComponent] = new WeaponComponent(entityID, 1, 15, false, 1);
        componentsDict[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.7, 150, 1, 1, 1750, 0, 0, ProjectileWeaponComponent.BULLET_MATERIAL);
        componentsDict[BulletWeaponComponent] = new BulletWeaponComponent(entityID, 7);
        return componentsDict;

    }

}