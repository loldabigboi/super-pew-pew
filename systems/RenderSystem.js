class RenderSystem extends System {

    constructor() {

        super([
            RenderComponent
        ])

    }

    update() {

        const canvas = document.getElementsByTagName('canvas')[0];
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const entityID of Object.keys(this.entities)) {

            const c = this.entities[entityID];
            const renderC = c[RenderComponent];

            ctx.strokeStyle = renderC.strokeColor;
            ctx.fillStyle = renderC.fillColor;

            if (c[TransformComponent] != undefined) {
                const transformC = c[TransformComponent];
                ctx.fillRect(transformC.x - transformC.offsetX, transformC.y - transformC.offsetY, 
                                transformC.width, transformC.height);
            } else if (c[PhysicsComponent] != null) {

                const physicsC = c[PhysicsComponent];
                const body = physicsC.body;
                const pos = body.interpolatedPosition;
                const x = pos[0], y = pos[1];
                for (const shape of body.shapes) {  //  render each shape individually
                    const shapeX = x + shape.position[0], shapeY = y + shape.position[1];
                    if (shape instanceof p2.Box) {
                        ctx.fillRect(shapeX, shapeY, shape.width, shape.height);
                    } else if (shape instanceof p2.Circle) {
                        ctx.beginPath();
                        ctx.arc(shapeX, shapeY, shape.radius, 0, 2*Math.PI, false);
                        ctx.fill();
                        ctx.stroke();
                        ctx.closePath();
                    }
                }

            }
            

        }

    }

}
