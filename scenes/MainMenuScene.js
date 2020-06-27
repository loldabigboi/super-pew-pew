class MainMenuScene extends Scene {

    constructor() {

        super();

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

        const buttonID = Entity.GENERATE_ID();
        const buttonC = ButtonFactory.createSimpleButton(buttonID, {
            fill: 'red'
        }, {
            fill: 'blue'
        }, {
            fill: 'lightgreen'
        });
        buttonC[MouseInteractableComponent].onClick.push(() => console.log("click"));
        buttonC[TransformComponent] = new TransformComponent(buttonID, [0,0], 0);
        buttonC[ShapeComponent] = new ShapeComponent(buttonID, p2.Shape.BOX, {width: 100, height: 50}, [0,0], [-0.5,-0.5], 0);
        this.addEntity(buttonID, buttonC);

    }

}