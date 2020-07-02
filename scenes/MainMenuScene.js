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

        const titleBgID = Entity.GENERATE_ID();
        const titleBgC = {};
        titleBgC[TransformComponent] = new TransformComponent(titleBgID, [canvas.width/2, 200], 0);
        titleBgC[RenderComponent] = new RenderComponent(titleBgID, {
            stroke: {h:0,s:100,l:50},
            strokeWidth: 3,
        });
        titleBgC[TextRenderComponent] = new TextRenderComponent(titleBgID, 'Super Pew Pew', {
            fontFamily: 'ArcadeIn',
            fontSize: 100
        });

        const yCallback = CallbackFactory.createFnAttributeModifier(Math.sin, titleBgC[TransformComponent], ['position', '1'], 4, 0.069),
        rotCallback = CallbackFactory.createFnAttributeModifier(Math.sin, titleBgC[TransformComponent], ['angle'], 0.1, 0.03),
        fontCallback = CallbackFactory.createFnAttributeModifier(Math.sin, titleBgC[TextRenderComponent], ['fontSize'], 5, 0.05);

        titleBgC[LoopCallbackComponent] = [new LoopCallbackComponent(titleBgID, () => {
            yCallback();
            rotCallback();
            fontCallback();
            titleBgC[RenderComponent].stroke.h += 1.5;
        })];

        this.addEntity(titleBgID, titleBgC);


        const buttonID = Entity.GENERATE_ID();
        const buttonC = GUIFactory.createSimpleButton(buttonID, 0, {
            fill: {r:255,g:255,b:255},
            stroke: {},
            fontSize: 72
        }, {
            fontSize: 86,
            stroke: {h:0,s:100,l:50}
        }, {
            fill: {r:225,g:225,b:225}
        });
        buttonC[MouseInteractableComponent].listeners.mouseup.push(() => this.game.changeScene(new GameScene(this.game)));
        buttonC[TransformComponent] = new TransformComponent(buttonID, [canvas.width/2, 350], 0);
        buttonC[ShapeComponent] = new ShapeComponent(buttonID, p2.Shape.BOX, {width: 140, height: 35}, [0,0], [0,0], 0);
        buttonC[TextRenderComponent] = new TextRenderComponent(buttonID, 'PLAY', {
            fontSize: 72, 
            fontFamily: 'ArcadeIn'
        });
        buttonC[LoopCallbackComponent] = [new LoopCallbackComponent(buttonID, () => {
            if (buttonC[RenderComponent].stroke.h != undefined) {
                buttonC[RenderComponent].stroke.h += 3;
            }
        })]
        this.addEntity(buttonID, buttonC);
        
    }

}