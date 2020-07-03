class Game {

    constructor() {
        const canvas = document.getElementsByTagName("canvas")[0];
        canvas.width = 1000;
        canvas.height = 600;

        this.scenes = {}

        this.changeScene(new MainMenuScene(this));
        this.loadResources();

    }

    loadResources() {
        this.run(Date.now());
    }

    addScene(scene) {
        this.scenes[scene.constructor] = scene;
    }

    changeScene(scene) {
        this.currScene = scene;
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
