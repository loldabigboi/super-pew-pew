class RenderSystem extends System {

    constructor() {

        super([
            RenderComponent
        ])

    }

    update() {

        for (const entityID of this.entities.keys()) {

            const c = this.entities[entityID];
            const renderC = c[RenderComponent];

            stroke(renderC.strokeColor);
            fill(renderC.fillColor);

            if (c[TransformComponent] != undefined) {
                const transformC = c[TransformComponent];
                rect(transformC.x - transformC.offsetX, transformC.y - transformC.offsetY, 
                    transformC.width, transformC.height);
            } else if (c[PhysicsComponent] != null) {

                const physicsC = c[PhysicsComponent];
                const body = physicsC.body;
                const pos = body.interpolatedPosition;
                const x = pos[0], y = pos[1];
                for (const shape of body.shapes) {  //  render each shape individually
                    const shapeX = x + shape.position[0], shapeY = y + shape.position[1];
                    if (shape instanceof Box) {
                        rect(shapeX, shapeY, shape.width, shape.height);
                    } else if (shape instanceof Circle) {
                        circle(shapeX, shapeY, shape.radius);
                    }
                }

            }
            

        }

    }

}