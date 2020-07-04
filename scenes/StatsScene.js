class StatsScene extends Scene {

    constructor(game) {

        super(game);

        this.addSystem(new MouseInteractableSystem(), 2);
        this.addSystem(new RenderSystem(), 3);
        this.addSystem(new DelayedCallbackSystem(), 4);
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
        titleC[TransformComponent] = new TransformComponent(titleID, [canvas.width/2, 75], 0);
        titleC[RenderComponent] = new RenderComponent(titleID, {
            fill: {h:0,s:100,l:50},
            strokeWidth: 3,
            shadowBlur: 2,
            shadowColor: 'fill'
        });
        titleC[TextRenderComponent] = new TextRenderComponent(titleID, 'Your stats', {
            fontFamily: 'ArcadeIn',
            fontSize: 72
        });

        const yCallback = CallbackFactory.createFnAttributeModifier(Math.sin, titleC[TransformComponent], ['position', '1'], 2, 0.069),
        rotCallback = CallbackFactory.createFnAttributeModifier(Math.sin, titleC[TransformComponent], ['angle'], 0.05, 0.03),
        fontCallback = CallbackFactory.createFnAttributeModifier(Math.sin, titleC[TextRenderComponent], ['fontSize'], 2, 0.05);

        titleC[LoopCallbackComponent] = [new LoopCallbackComponent(titleID, () => {
            yCallback();
            rotCallback();
            fontCallback();
            titleC[RenderComponent].fill.h += 1.5;
        })];

        this.addEntity(titleID, titleC);

        const statsContainerID = Entity.GENERATE_ID();
        const statsContainerC = {};
        statsContainerC[TransformComponent] = new TransformComponent(statsContainerID, [canvas.width/2, 310], 0);
        
        this.addEntity(statsContainerID, statsContainerC);

        const entryWidth = 750;
        const entryHeight = 55;
        const entryFontSize = 44;

        let entityID = Entity.GENERATE_ID();
        let c = {};
        const entryContainerIDs = [];
        for (let i = 0; i < 6; i++) {
            let c = {};
            c[ParentComponent] = new ParentComponent(entityID, statsContainerID, [0,0], [0,0]);
            c[TransformComponent] = new TransformComponent(entityID, [0, (i-2.5)*entryHeight], 0);
            c[ShapeComponent] = new ShapeComponent(entityID, p2.Shape.BOX, {width: entryWidth, height: entryHeight}, [0,0], [0,0], 0);
            entryContainerIDs.push(entityID);
            this.addEntity(entityID, c);
            entityID = Entity.GENERATE_ID();
        }

        const timePlayed = StatsManager.getTimePlayed();
        const h = Math.floor(timePlayed / (1000*60*60)),
              m = Math.floor(timePlayed / (1000*60)) % 60,
              s = Math.floor(timePlayed / (1000)) % 60;
        const timeString = (h ? h + 'h ' : '') + (m ? m + 'm ' : '') + s + 's';
        
        entityID = Entity.GENERATE_ID();
        c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, entryContainerIDs[0], [0,0], [-0.5, 0]);
        c[TextRenderComponent] = new TextRenderComponent(entityID, 'Time played', {fontSize: entryFontSize, fontFamily: 'ArcadeIn', propOffset: [0.5,0]})
        c[RenderComponent] = new RenderComponent(entityID, {fill: {r:255,g:255,b:255, shadowBlur: 1, shadowColor: 'fill'}});
        this.addEntity(entityID, c);

        entityID = Entity.GENERATE_ID();
        c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, entryContainerIDs[0], [0,0], [0.5, 0]);
        c[TextRenderComponent] = new TextRenderComponent(entityID, timeString, {fontSize: entryFontSize, fontFamily: 'ArcadeIn', propOffset: [-0.5,0]})
        c[RenderComponent] = new RenderComponent(entityID, {fill: {r:255,g:255,b:255, shadowBlur: 1, shadowColor: 'fill'}});
        this.addEntity(entityID, c);

        entityID = Entity.GENERATE_ID();
        c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, entryContainerIDs[1], [0,0], [-0.5, 0]);
        c[TextRenderComponent] = new TextRenderComponent(entityID, 'Games played', {fontSize: entryFontSize, fontFamily: 'ArcadeIn', propOffset: [0.5,0]})
        c[RenderComponent] = new RenderComponent(entityID, {fill: {r:255,g:255,b:255, shadowBlur: 1, shadowColor: 'fill'}});
        this.addEntity(entityID, c);

        entityID = Entity.GENERATE_ID();
        c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, entryContainerIDs[1], [0,0], [0.5, 0]);
        c[TextRenderComponent] = new TextRenderComponent(entityID, ''+StatsManager.getDeaths(), {fontSize: entryFontSize, fontFamily: 'ArcadeIn', propOffset: [-0.5,0]})
        c[RenderComponent] = new RenderComponent(entityID, {fill: {r:255,g:255,b:255, shadowBlur: 1, shadowColor: 'fill'}});
        this.addEntity(entityID, c);

        entityID = Entity.GENERATE_ID();
        c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, entryContainerIDs[2], [0,0], [-0.5, 0]);
        c[TextRenderComponent] = new TextRenderComponent(entityID, 'Enemies killed', {fontSize: entryFontSize, fontFamily: 'ArcadeIn', propOffset: [0.5,0]})
        c[RenderComponent] = new RenderComponent(entityID, {fill: {r:255,g:255,b:255, shadowBlur: 1, shadowColor: 'fill'}});
        this.addEntity(entityID, c);

        entityID = Entity.GENERATE_ID();
        c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, entryContainerIDs[2], [0,0], [0.5, 0]);
        c[TextRenderComponent] = new TextRenderComponent(entityID, ''+StatsManager.getEnemiesKilled(), {fontSize: entryFontSize, fontFamily: 'ArcadeIn', propOffset: [-0.5,0]})
        c[RenderComponent] = new RenderComponent(entityID, {fill: {r:255,g:255,b:255, shadowBlur: 1, shadowColor: 'fill'}});
        this.addEntity(entityID, c);

        entityID = Entity.GENERATE_ID();
        c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, entryContainerIDs[3], [0,0], [-0.5, 0]);
        c[TextRenderComponent] = new TextRenderComponent(entityID, 'Shots fired', {fontSize: entryFontSize, fontFamily: 'ArcadeIn', propOffset: [0.5,0]})
        c[RenderComponent] = new RenderComponent(entityID, {fill: {r:255,g:255,b:255, shadowBlur: 1, shadowColor: 'fill'}});
        this.addEntity(entityID, c);

        entityID = Entity.GENERATE_ID();
        c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, entryContainerIDs[3], [0,0], [0.5, 0]);
        c[TextRenderComponent] = new TextRenderComponent(entityID, ''+StatsManager.getShotsFired(), {fontSize: entryFontSize, fontFamily: 'ArcadeIn', propOffset: [-0.5,0]})
        c[RenderComponent] = new RenderComponent(entityID, {fill: {r:255,g:255,b:255, shadowBlur: 1, shadowColor: 'fill'}});
        this.addEntity(entityID, c);

        entityID = Entity.GENERATE_ID();
        c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, entryContainerIDs[4], [0,0], [-0.5, 0]);
        c[TextRenderComponent] = new TextRenderComponent(entityID, 'Weapon crates collected', {fontSize: entryFontSize, fontFamily: 'ArcadeIn', propOffset: [0.5,0]})
        c[RenderComponent] = new RenderComponent(entityID, {fill: {r:255,g:255,b:255, shadowBlur: 1, shadowColor: 'fill'}});
        this.addEntity(entityID, c);

        entityID = Entity.GENERATE_ID();
        c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, entryContainerIDs[4], [0,0], [0.5, 0]);
        c[TextRenderComponent] = new TextRenderComponent(entityID, ''+StatsManager.getCratesPickedUp(), {fontSize: entryFontSize, fontFamily: 'ArcadeIn', propOffset: [-0.5,0]})
        c[RenderComponent] = new RenderComponent(entityID, {fill: {r:255,g:255,b:255, shadowBlur: 1, shadowColor: 'fill'}});
        this.addEntity(entityID, c);

        entityID = Entity.GENERATE_ID();
        c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, entryContainerIDs[5], [0,0], [-0.5, 0]);
        c[TextRenderComponent] = new TextRenderComponent(entityID, 'Highscore', {fontSize: entryFontSize, fontFamily: 'ArcadeIn', propOffset: [0.5,0]})
        c[RenderComponent] = new RenderComponent(entityID, {fill: {r:255,g:255,b:255, shadowBlur: 1, shadowColor: 'fill'}});
        this.addEntity(entityID, c);

        entityID = Entity.GENERATE_ID();
        c = {};
        c[TransformComponent] = new TransformComponent(entityID, [0,0], 0);
        c[ParentComponent] = new ParentComponent(entityID, entryContainerIDs[5], [0,0], [0.5, 0]);
        c[TextRenderComponent] = new TextRenderComponent(entityID, ''+StatsManager.getHighscore(), {fontSize: entryFontSize, fontFamily: 'ArcadeIn', propOffset: [-0.5,0]})
        c[RenderComponent] = new RenderComponent(entityID, {fill: {r:255,g:255,b:255, shadowBlur: 1, shadowColor: 'fill'}});
        this.addEntity(entityID, c);
        

        const buttonID = Entity.GENERATE_ID();
        const buttonC = GUIFactory.createSimpleButton(buttonID, 0, {
            stroke: {r:255,g:255,b:255},
            strokeWidth: 1,
            fontSize: 48,
            shadowBlur: 1,
            shadowColor: 'stroke'
        }, {
            fontSize: 54,
            stroke: {r:100,g:255,b:255}
        }, {
            fontSize: 46,
            stroke: {r:100,g:200,b:200}
        });
        buttonC[MouseInteractableComponent].listeners.mouseup.push(() => this.game.changeScene(new MainMenuScene(this.game)));
        buttonC[TransformComponent] = new TransformComponent(buttonID, [canvas.width/2, canvas.height-70], 0);
        buttonC[ShapeComponent] = new ShapeComponent(buttonID, p2.Shape.BOX, {width: 140, height: 35}, [0,0], [0,0], 0);
        buttonC[TextRenderComponent] = new TextRenderComponent(buttonID, 'BACK', {
            fontSize: 48, 
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