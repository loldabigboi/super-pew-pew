class Game {

    constructor() {
        const canvas = document.getElementsByTagName("canvas")[0];
        canvas.width = 1000;
        canvas.height = 600;

        this.scenes = {}
        this.addScene(new GameScene(this));
        this.addScene(new MainMenuScene(this));

        this.changeScene(MainMenuScene);
    }

    addScene(scene) {
        this.scenes[scene.constructor] = scene;
    }

    changeScene(sceneConstructor) {
        this.currScene = this.scenes[sceneConstructor];
    }

    run(last) {

        let now = Date.now();
        let dt = (now - last) / 100;
        this.currScene.update(dt);

        window.requestAnimationFrame(() => {
            this.run(now);
        })
        
    }

}
