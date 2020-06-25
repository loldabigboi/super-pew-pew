const { Shape } = require("p2");

class ParticleEmitterFactory {

    static createSimpleEmitter(entityID, particleShapeType, particleShapeOptions, options, interval, startAngle, endAngle) {

        const c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[RepeatingCallbackComponent] = [new RepeatingCallbackComponent(entityID, interval, (obj) => {

            const particleID = Entity.GENERATE_ID();
            const particleC = {};

            const speed = options.speed == undefined ? 20 : options.speed;

            const vel = [speed, 0];
            p2.vec2.rotate(vel, vel, startAngle + (endAngle - startAngle)*Math.random());
            particleC[ShapeComponent] = new ShapeComponent(particleID, particleShapeType, particleShapeOptions, [0,0], [0,0], 0);
            partcileC[PhysicsComponent] = new PhysicsComponent(particleID, {
                velocity: vel,
                damping: options.damping || 0.5,
                gravityScale: options.gravityScale || 0
            }, [particleC[ShapeComponent]]);

            particleC[RenderComponent] = new RenderComponent(particleID, options.fill || 'lightgrey', options.stroke, 1, GameScene.WEAPON_LAYER);
            particleC[DelayedCallbackComponent] = [new DelayedCallbackComponent(particleID, options.lifetime || 1000, Callbacks.DELETE_ENTITY)];

            if (options.fadeRate) {
                particleC[RepeatingCallbackComponent] = [new RepeatingCallbackComponent(particleID, 20, () => {
                    particleC[RenderComponent].opacity = Math.max(0, particleC[RenderComponent].opacity - options.fadeRate);
                })]
            }

            obj.scene.addEvent(new TransmittedEvent(null, particleID, null, Scene.ADD_ENTITY_EVENT, {
                components: particleC
            }));

        })];

    }

}