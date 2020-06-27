class WeaponFactory {

    static createPistol(entityID, parentID) {

        const w = 18, h = 6;

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'red', 'red', 1, GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [w/2, 0], Offsets.NONE, 0);
        c[ParentComponent] = new ParentComponent(entityID, parentID, Offsets.NONE, Offsets.NONE);
        c[TransformComponent] = new TransformComponent(entityID, Offsets.NONE, 0);
        c[WeaponComponent] = new WeaponComponent(entityID, 1, 75, true, 1);
        c[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.05, 0, 125, 0, 1, 1, 3000, 0, 0, p2.Shape.CIRCLE, {radius: 6}, ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL);

        return c;
            
    }

    static createMachineGun(entityID, parentID) {

        const w = 20, h = 6;

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'orange', 'orange', 1, GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [w/2, 0], Offsets.NONE, 0);
        c[ParentComponent] = new ParentComponent(entityID, parentID, Offsets.NONE, Offsets.NONE);
        c[TransformComponent] = new TransformComponent(entityID, Offsets.NONE, 0);
        c[WeaponComponent] = new WeaponComponent(entityID, 1, 50, false, 1);
        c[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.1, 0, 125, 0, 1, 1, 2500, 0, 0, p2.Shape.CIRCLE, {radius: 6}, ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL, {}, (obj) => {
            obj.scene.screenShake += 0.8;
        });

        return c;

    }

    static createShotgun(entityID, parentID) {

        const w = 20, h = 8;

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'green', 'green', 1, GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [w/2, 0], Offsets.NONE, 0);
        c[ParentComponent] = new ParentComponent(entityID, parentID, Offsets.NONE, Offsets.NONE);
        c[TransformComponent] = new TransformComponent(entityID, Offsets.NONE, 0);
        c[WeaponComponent] = new WeaponComponent(entityID, 8, 600, true, 1);
        c[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.5, 5, 125, 100, 1, 1, 200, 0, 0.3, p2.Shape.CIRCLE, {radius: 6}, ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL, {}, (obj) => {
            obj.scene.screenShake += 0.5;
        });

        return c;

    }

    static createMinigun(entityID, parentID) {

        const w = 30, h = 16;

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'purple', 'purple', 1, GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [w/4, 0], Offsets.NONE, 0);
        c[ParentComponent] = new ParentComponent(entityID, parentID, [0, 4], Offsets.NONE);
        c[TransformComponent] = new TransformComponent(entityID, Offsets.NONE, 0);
        c[WeaponComponent] = new WeaponComponent(entityID, 1, 15, false, 1);
        c[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0.7, 200, 150, 0, 1, 1, 1750, 0, 0, p2.Shape.CIRCLE, {radius: 6}, ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL, {}, (obj) => {
            obj.scene.screenShake += 1.2;
        });

        return c;

    }

    static createExplosion(entityID, position, initSize, dSize, maxSize) {

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'rgba(255,165,0,0.75)', undefined, 1, GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.CIRCLE, {radius: initSize}, Offsets.NONE, Offsets.NONE, 0, ShapeComponent.GROUPS.PROJ,
            ShapeComponent.MASKS.PROJ, 0);
        c[ContactDamageComponent] = new ContactDamageComponent(entityID, 100, Infinity, undefined, -1);
        c[PhysicsComponent] = new PhysicsComponent(entityID, {position: position.slice(), collisionResponse: false, mass:0}, [c[ShapeComponent]]);
        c[DelayedCallbackComponent] = [new DelayedCallbackComponent(entityID, 500, Callbacks.DELETE_ENTITY)];
        c[RepeatingCallbackComponent] = [new RepeatingCallbackComponent(entityID, 30, () => {
            c[RenderComponent].opacity = Math.max(0, c[RenderComponent].opacity - 0.06);
            c[ShapeComponent].shape.radius = Math.min(maxSize, c[ShapeComponent].shape.radius + dSize);
        })];

        return c;
    
    }

    static createRocketLauncher(entityID, parentID, entities) {

        const w = 40, h = 15;

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'cyan', 'cyan', 1, GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0, 0], Offsets.NONE, 0);
        c[ParentComponent] = new ParentComponent(entityID, parentID, [0, -7], Offsets.NONE);
        c[TransformComponent] = new TransformComponent(entityID, Offsets.NONE, 0);
        c[WeaponComponent] = new WeaponComponent(entityID, 1, 1200, true, 1);
        c[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0, 0, 80, 0, 1, 1, 4000, 0, -0.25, p2.Shape.BOX, {width:30, height:10}, ProjectileWeaponComponent.LOSSLESS_BOUNCE_MATERIAL, {
            onDeath: (obj) => {
                obj.scene.screenShake += 15;

                const projC = obj.scene.entities[obj.id];
                const position = projC[PhysicsComponent].body.position;

                const explosionID = Entity.GENERATE_ID();
                const explosionC = WeaponFactory.createExplosion(explosionID, position.slice(), 25, 45, 125);
                Callbacks.DELETE_ENTITY(obj);
                obj.scene.addEvent(new TransmittedEvent(null, explosionID, null, Scene.ADD_ENTITY_EVENT, {
                    components: explosionC
                }));
            },

        }, (obj) => {

            const id = Entity.GENERATE_ID();
            const angle = c[TransformComponent].angle + Math.PI;
            const particleC = ParticleEmitterFactory.createSimpleEmitter(id, entities, p2.Shape.CIRCLE, {radius: 17, radiusVariance: 2}, {
                fadeRate: 0.02, 
                speed: 8, 
                damping: 0.1,
                speedVariance: 4,
                lifetimeVariance: 400,
            }, 12, angle-Math.PI/4, angle+Math.PI/4);
            particleC[ParentComponent] = new ParentComponent(id, obj.projID, [0,0], [0,0], Callbacks.DELETE_ENTITY);

            obj.scene.addEvent(new TransmittedEvent(null, id, null, Scene.ADD_ENTITY_EVENT, {
                components: particleC
            }));

        });
        return c;

    }

    static createGrenadeLauncher(entityID, parentID) {

        const w = 32, h = 18;

        const c = {};
        c[RenderComponent] = new RenderComponent(entityID, 'pink', 'pink', 1, GameScene.WEAPON_LAYER);
        c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: w, height: h}, [0, 0], Offsets.NONE, 0);
        c[TransformComponent] = new TransformComponent(entityID, Offsets.NONE, 0);
        c[ParentComponent] = new ParentComponent(entityID, parentID, [0, 5], Offsets.NONE);
        c[WeaponComponent] = new WeaponComponent(entityID, 1, 1000, true, 1);
        c[ProjectileWeaponComponent] = new ProjectileWeaponComponent(entityID, 0, 0, 100, 0, Infinity, 1, 2500, 1.5, 0, p2.Shape.CIRCLE, {radius: 8}, ProjectileWeaponComponent.LOSS_BOUNCE_MATERIAL, {
            onDeath: (obj) => {
                obj.scene.screenShake += 15;

                const c = obj.scene.entities[obj.id];
                const position = c[PhysicsComponent].body.position;

                const explosionID = Entity.GENERATE_ID();
                const explosionC = WeaponFactory.createExplosion(explosionID, position.slice(), 25, 45, 125);
                Callbacks.DELETE_ENTITY(obj);
                obj.scene.addEvent(new TransmittedEvent(null, explosionID, null, Scene.ADD_ENTITY_EVENT, {
                    components: explosionC
                }));
            }
        });
        return c;

    }

    static createMineWeapon(entityID, parentID) {

    }

}