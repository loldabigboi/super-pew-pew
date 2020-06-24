class WeaponFactory {

    static createPistol(entityID, trackID) {

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'red', 'red', GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: 20, height: 5}, [0, 0], ShapeComponent.CENTER_LEFT, 0);
        c[TransformComponent] = new TransformComponent(entityID, [0, 0], 0);
        c[TrackingComponent] = new TrackingComponent(entityID, trackID, ShapeComponent.CENTER, [0, 3], 1);
        c[FatalDependencyComponent] = new FatalDependencyComponent(entityID, trackID);
        c[WeaponComponent] = new WeaponComponent(entityID, 1, 75, true, 1);
        c[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.05, 0, 125, 0, 1, 1, 3000, 0, 0, p2.Shape.CIRCLE, {radius: 6}, ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL);

        return c;
            
    }

    static createMachineGun(entityID, trackID) {

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'orange', 'orange', GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: 25, height: 5}, [0, 0], ShapeComponent.CENTER_LEFT, 0);
        c[TransformComponent] = new TransformComponent(entityID, [0, 0], 0);
        c[TrackingComponent] = new TrackingComponent(entityID, trackID, ShapeComponent.CENTER, [0, 3], 1);
        c[FatalDependencyComponent] = new FatalDependencyComponent(entityID, trackID);
        c[WeaponComponent] = new WeaponComponent(entityID, 1, 50, false, 1);
        c[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.1, 0, 125, 0, 1, 1, 2500, 0, 0, p2.Shape.CIRCLE, {radius: 6}, ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL);

        return c;

    }

    static createShotgun(entityID, trackID) {

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'green', 'green', GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: 25, height: 8}, [0, 0], ShapeComponent.CENTER_LEFT, 0);
        c[TransformComponent] = new TransformComponent(entityID, [0, 0], 0);
        c[TrackingComponent] = new TrackingComponent(entityID, trackID, ShapeComponent.CENTER, [0, 3], 1);
        c[FatalDependencyComponent] = new FatalDependencyComponent(entityID, trackID);
        c[WeaponComponent] = new WeaponComponent(entityID, 8, 600, true, 1);
        c[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.5, 5, 125, 100, 1, 1, 200, 0, 0.3, p2.Shape.CIRCLE, {radius: 6}, ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL);

        return c;

    }

    static createMinigun(entityID, trackID) {

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'purple', 'purple', GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: 30, height: 12}, [-6, 0], ShapeComponent.CENTER_LEFT, 0);
        c[TransformComponent] = new TransformComponent(entityID, [0, 0], 0);
        c[TrackingComponent] = new TrackingComponent(entityID, trackID, ShapeComponent.CENTER, [0, 3], 1);
        c[FatalDependencyComponent] = new FatalDependencyComponent(entityID, trackID);
        c[WeaponComponent] = new WeaponComponent(entityID, 1, 15, false, 1);
        c[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.7, 200, 150, 0, 1, 1, 1750, 0, 0, p2.Shape.CIRCLE, {radius: 6}, ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL);

        return c;

    }

    static createExplosion(entityID, position, size) {

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'rgba(255,165,0,0.5)', 'rgba(255,165,0,0.5)', GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.CIRCLE, {radius: size}, [0,0], [0,0], 0, ShapeComponent.GROUPS.PROJ,
            ShapeComponent.MASKS.PROJ, 0);
        c[ContactDamageComponent] = new ContactDamageComponent(entityID, 100, Infinity, undefined, -1);
        c[PhysicsComponent] = new PhysicsComponent(entityID, {position: position.slice(), collisionResponse: false, mass:0}, [c[ShapeComponent]]);
        c[LifetimeComponent] = new LifetimeComponent(entityID, 800);

        return c;
    
    }

    static createRocketLauncher(entityID, trackID) {

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'cyan', 'cyan', GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: 40, height: 15}, [0, 0], ShapeComponent.CENTER, 0);
        c[TransformComponent] = new TransformComponent(entityID, [0, 0], 0);
        c[TrackingComponent] = new TrackingComponent(entityID, trackID, ShapeComponent.CENTER, [0, -8], 1);
        c[FatalDependencyComponent] = new FatalDependencyComponent(entityID, trackID);
        c[WeaponComponent] = new WeaponComponent(entityID, 1, 1200, true, 1);
        c[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0, 0, 80, 0, 1, 1, 4000, 0, -0.25, p2.Shape.CIRCLE, {radius: 8}, ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL, {
            onDeath: (obj) => {
                const c = obj.scene.entities[obj.id];
                const position = c[PhysicsComponent].body.position;

                const explosionID = Entity.GENERATE_ID();
                const explosionC = WeaponFactory.createExplosion(explosionID, position.slice(), 100);
                Callbacks.DELETE_ENTITY(obj);
                obj.scene.addEvent(new TransmittedEvent(null, explosionID, null, Scene.ADD_ENTITY_EVENT, {
                    components: explosionC
                }));
            }
        });
        return c;

    }

    static createGrenadeLauncher(entityID, trackID) {

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'pink', 'pink', GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: 30, height: 15}, [-10, 0], ShapeComponent.CENTER_LEFT, 0);
        c[TransformComponent] = new TransformComponent(entityID, [0, 0], 0);
        c[TrackingComponent] = new TrackingComponent(entityID, trackID, ShapeComponent.CENTER, [0, 5], 1);
        c[FatalDependencyComponent] = new FatalDependencyComponent(entityID, trackID);
        c[WeaponComponent] = new WeaponComponent(entityID, 1, 1000, true, 1);
        c[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0, 0, 100, 0, 4, 1, 2500, 1.5, 0, p2.Shape.CIRCLE, {radius: 8}, ProjectileWeaponComponent.LOSS_BOUNCE_MATERIAL, {
            onDeath: (obj) => {
                const c = obj.scene.entities[obj.id];
                const position = c[PhysicsComponent].body.position;

                const explosionID = Entity.GENERATE_ID();
                const explosionC = WeaponFactory.createExplosion(explosionID, position.slice(), 100);
                Callbacks.DELETE_ENTITY(obj);
                obj.scene.addEvent(new TransmittedEvent(null, explosionID, null, Scene.ADD_ENTITY_EVENT, {
                    components: explosionC
                }));
            }
        });
        return c;

    }

    static createMineWeapon(entityID, trackID) {

    }

}