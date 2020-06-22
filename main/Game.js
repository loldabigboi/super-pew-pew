class Game {

    constructor() {
        this.scenes = {}
        this.currScene = new GameScene();       
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
