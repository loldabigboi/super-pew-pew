class MainMenuScene extends Scene {

    constructor(game) {

        super(game);

        const physicsSystem = new PhysicsSystem();

        this.addSystem(physicsSystem, 1);
        this.addSystem(new BasicEnemyAISystem(physicsSystem.world), 1);
        this.addSystem(new MouseInteractableSystem(), 2);
        this.addSystem(new ProjectileWeaponSystem(), 2);
        this.addSystem(new ProjectileSystem(physicsSystem.world), 2);
        this.addSystem(new JumpSystem(physicsSystem.world), 2);
        this.addSystem(new TeleporterSystem(physicsSystem.world), 2);
        this.addSystem(new ContactDamageSystem(physicsSystem.world), 2);
        this.addSystem(new RenderSystem(), 3);
        this.addSystem(new FatalDependencySystem(), 4);
        this.addSystem(new DelayedCallbackSystem(), 5);
        this.addSystem(new RepeatingCallbackSystem(), 5);
        this.addSystem(new LoopCallbackSystem(), 5);
        this.addSystem(new ParentSystem(), 5);

        this.createUI();
    }

    createUI() {

        const canvas = document.getElementsByTagName('canvas')[0];

        const backgroundID = Entity.GENERATE_ID();
        const backgroundC = {};
        backgroundC[TransformComponent] = new TransformComponent(backgroundID, [canvas.width/2, canvas.height/2], 0);
        backgroundC[ShapeComponent] = new ShapeComponent(backgroundID, p2.Shape.BOX, {width: canvas.width, height: canvas.height}, [0,0], [0,0], -1);
        backgroundC[RenderComponent] = new RenderComponent(backgroundID, {
            fill: {r:0,g:0,b:0,a:0.1}
        }, -1);
        this.addEntity(backgroundID, backgroundC);

        const titleID = Entity.GENERATE_ID();
        const titleC = {};
        titleC[TransformComponent] = new TransformComponent(titleID, [canvas.width/2, 170], 0);
        titleC[RenderComponent] = new RenderComponent(titleID, {
            fill: {h:0,s:100,l:50},
            strokeWidth: 3,
            shadowBlur: 2,
            shadowColor: 'fill'
        });
        titleC[TextRenderComponent] = new TextRenderComponent(titleID, 'Super Pew Pew', {
            fontFamily: 'ArcadeIn',
            fontSize: 100
        });

        const yCallback = CallbackFactory.createFnAttributeModifier(Math.sin, titleC[TransformComponent], ['position', '1'], 4, 0.069),
        rotCallback = CallbackFactory.createFnAttributeModifier(Math.sin, titleC[TransformComponent], ['angle'], 0.1, 0.03),
        fontCallback = CallbackFactory.createFnAttributeModifier(Math.sin, titleC[TextRenderComponent], ['fontSize'], 5, 0.05);

        titleC[LoopCallbackComponent] = [new LoopCallbackComponent(titleID, () => {
            yCallback();
            rotCallback();
            fontCallback();
            titleC[RenderComponent].fill.h += 1.5;
        })];

        this.addEntity(titleID, titleC);


        const playID = Entity.GENERATE_ID();
        const playC = GUIFactory.createSimpleButton(playID, 0, {
            stroke: {r:255,g:255,b:255},
            strokeWidth: 2,
            fontSize: 72,
            shadowBlur: 1,
            shadowColor: 'stroke'
        }, {
            fontSize: 76,
            stroke: {r:100,g:255,b:100}
        }, {
            fontSize: 68,
            stroke: {r:100,g:200,b:100}
        });
        playC[MouseInteractableComponent].listeners.mouseup.push(() => this.game.changeScene(new GameScene(this.game)));
        playC[TransformComponent] = new TransformComponent(playID, [canvas.width/2, 300], 0);
        playC[ShapeComponent] = new ShapeComponent(playID, p2.Shape.BOX, {width: 140, height: 35}, [0,0], [0,0], 0);
        playC[TextRenderComponent] = new TextRenderComponent(playID, 'PLAY', {
            fontSize: 72, 
            fontFamily: 'ArcadeIn'
        });
        playC[LoopCallbackComponent] = [new LoopCallbackComponent(playID, () => {
            if (playC[RenderComponent].stroke.h != undefined) {
                playC[RenderComponent].stroke.h += 3;
            }
        })]
        this.addEntity(playID, playC);

        const statsID = Entity.GENERATE_ID();
        const statsC = GUIFactory.createSimpleButton(statsID, 0, {
            stroke: {r:255,g:255,b:255},
            strokeWidth: 2,
            fontSize: 64,
            shadowBlur: 1,
            shadowColor: 'stroke'
        }, {
            fontSize: 68,
            stroke: {r:100,g:255,b:255}
        }, {
            fontSize: 60,
            stroke: {r:100,g:200,b:200}
        });
        statsC[MouseInteractableComponent].listeners.mouseup.push(() => this.game.changeScene(new StatsScene(this.game)));
        statsC[TransformComponent] = new TransformComponent(statsID, [canvas.width/2, 375], 0);
        statsC[ShapeComponent] = new ShapeComponent(statsID, p2.Shape.BOX, {width: 140, height: 35}, [0,0], [0,0], 0);
        statsC[TextRenderComponent] = new TextRenderComponent(statsID, 'STATS', {
            fontSize: 72, 
            fontFamily: 'ArcadeIn'
        });
        statsC[LoopCallbackComponent] = [new LoopCallbackComponent(statsID, () => {
            if (statsC[RenderComponent].stroke.h != undefined) {
                statsC[RenderComponent].stroke.h += 3;
            }
        })]
        this.addEntity(statsID, statsC);
        
    }

}