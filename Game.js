class Game {

    constructor() {
        this.scenes = {

        }
        this.currScene = Scene();

        // test code
        this.currScene.addSystem(new PhysicsSystem);
        this.currScene.addSystem(new RenderSystem)
    }

    run() {

        let last = Date.now();
        let dt, now;
        while (true) {

            now = Date.now();
            dt = (now - last) / 1000;
            this.currScene.update(dt);
            last = now;

        }

    }

}