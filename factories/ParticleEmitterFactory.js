class ParticleEmitterFactory {

    static createSimpleEmitter(entityID, entities, particleShapeType, particleShapeOptions, options, interval, startAngle, endAngle, onCreation=()=>{}) {

        const c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[RepeatingCallbackComponent] = [new RepeatingCallbackComponent(entityID, interval, (obj) => {

            const particleID = Entity.GENERATE_ID();
            const particleC = {};

            const speed = options.speed == undefined ? 20 : options.speed;

            const speedVariance = options.speedVariance || 0;
            const vel = [speed - speedVariance/2 + speedVariance*Math.random(), 0];
            p2.vec2.rotate(vel, vel, startAngle + (endAngle - startAngle)*Math.random());
            if (particleShapeOptions.radiusVariance) {
                particleShapeOptions.radius += -particleShapeOptions.radiusVariance/2 + particleShapeOptions.radiusVariance*Math.random();
            }
            particleC[ShapeComponent] = new ShapeComponent(particleID, particleShapeType, particleShapeOptions, [0,0], [0,0], 0);
            particleC[PhysicsComponent] = new PhysicsComponent(particleID, {
                position: ParentComponent.getAbsolutePosition(entityID, entities),
                velocity: vel,
                mass: 1,
                gravityScale: options.gravityScale || 0,
                damping: options.damping
            }, [particleC[ShapeComponent]]);

            particleC[RenderComponent] = new RenderComponent(particleID, {
                    fill: options.fill || {r:255,g:255,b:255}, 
                    stroke: options.stroke || {},
                    strokeWidth: options.strokeWidth,
                    opacity: options.opacity || 1
            }, GameScene.WEAPON_LAYER);

            const lifeVariance = options.lifetimeVariance || 0;
            particleC[DelayedCallbackComponent] = [new DelayedCallbackComponent(particleID, 
                (options.lifetime || 1000) -lifeVariance/2 + lifeVariance*Math.random(), 
            Callbacks.DELETE_ENTITY)];

            if (options.fadeRate) {
                particleC[RepeatingCallbackComponent] = [new RepeatingCallbackComponent(particleID, 20, () => {
                    particleC[RenderComponent].opacity = Math.max(0, particleC[RenderComponent].opacity - options.fadeRate);
                })]
            }
            if (options.dRadius) {
                particleC[RepeatingCallbackComponent].push(new RepeatingCallbackComponent(particleID, 20, () => {
                    particleC[ShapeComponent].shape.radius += options.dRadius;
                }));
            }

            onCreation({
                id: particleID,
                components: particleC
            })
            obj.scene.addEvent(new TransmittedEvent(null, particleID, null, Scene.ADD_ENTITY_EVENT, {
                components: particleC
            }));

        })];
        return c;

    }

}