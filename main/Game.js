class Game {

    constructor() {
        this.scenes = {

        }
        this.currScene = new GameScene();

        // hard-coded test

        

    }

    run(last) {

        let now = Date.now();
        let dt = (now - last) / 100;
        this.currScene.update(dt);

        const thisRef = this;
        window.requestAnimationFrame(() => {
            thisRef.run(now);
        })
        
    }

}
