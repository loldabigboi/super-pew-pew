class Game {

    constructor() {
        const canvas = document.getElementsByTagName("canvas")[0];
        canvas.width = 1000;
        canvas.height = 600;

        this.scenes = {}
        this.currScene = new GameScene();
        this.count = 0; 
    }

    run(last) {

        let now = Date.now();
        //console.log('loop ' + this.count++ + ' ' + now);
        let dt = (now - last) / 100;
        this.currScene.update(dt);

        window.requestAnimationFrame(() => {
            this.run(now);
        })
        
    }

}
