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

        const titleTextID = Entity.GENERATE_ID();
        const titleTextC = {};
        titleTextC[TransformComponent] = new TransformComponent(titleTextID, [canvas.width/2, 200], 0);
        titleTextC[TextRenderComponent] = new TextRenderComponent(titleTextID, 'super pew pew', {fontFamily: 'cursive', fontSize: 56});
        titleTextC[RenderComponent] = new RenderComponent(titleTextID, 'purple', 'orange', 2);
        titleTextC[LoopCallbackComponent] = [new LoopCallbackComponent(titleTextID,
            CallbackFactory.createFnAttributeModifier(Math.sin, titleTextC[TransformComponent], ['position', '1'], 4, 0.069)
        ), new LoopCallbackComponent(titleTextID, 
            CallbackFactory.createFnAttributeModifier(Math.sin, titleTextC[TransformComponent], ['angle'], 0.1, 0.03)
        ), new LoopCallbackComponent(titleTextID,
            CallbackFactory.createFnAttributeModifier(Math.sin, titleTextC[TextRenderComponent], ['fontSize'], 5, 0.05)
        )]
        this.addEntity(titleTextID, titleTextC);

        const buttonID = Entity.GENERATE_ID();
        const buttonC = ButtonFactory.createSimpleButton(buttonID, 0, {
            fill: 'red'
        }, {
            fill: 'blue'
        }, {
            fill: 'lightgreen'
        });
        buttonC[MouseInteractableComponent].listeners.mouseup.push(() => this.game.changeScene(GameScene));
        buttonC[TransformComponent] = new TransformComponent(buttonID, [canvas.width/2, 350], 0);
        buttonC[ShapeComponent] = new ShapeComponent(buttonID, p2.Shape.BOX, {width: 75, height: 50}, [0,0], [0,0], 0);
        this.addEntity(buttonID, buttonC);

        const buttonTextID = Entity.GENERATE_ID();
        const textC = {};
        textC[TransformComponent] = new TransformComponent(buttonTextID, [0,0], 0);
        textC[ParentComponent] = new ParentComponent(buttonTextID, buttonID, [0,0], [0,0]);
        textC[RenderComponent] = new RenderComponent(buttonTextID, 'white', 'white', 1, 3);
        textC[TextRenderComponent] = new TextRenderComponent(buttonTextID, 'play', {fontSize: 28, fontFamily: 'cursive'});
        this.addEntity(buttonTextID, textC);

    }

}