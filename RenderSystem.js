class RenderSystem extends System {

    constructor() {

        super([
            TransformComponent,
            RenderComponent
        ])

    }

    update() {

        for (const entityID of this.entities.keys()) {

            const c = this.entities[entityID];
            const renderC = c[RenderComponent];
            const transformC = c[TransformComponent];

            stroke(renderC.strokeColor);
            fill(renderC.fillColor);

            rect(transformC.x - transformC.offsetX, transformC.y - transformC.offsetY, 
                 transformC.width, transformC.height);

        }

    }

}