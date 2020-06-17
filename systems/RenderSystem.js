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
                ctx.translate(x, y);
                ctx.rotate(body.angle);
                for (const shape of body.shapes) {  //  render each shape individually
                    
                    const shapeX = shape.position[0], shapeY = shape.position[1];
                    const w = shape.width, h = shape.height;
                    ctx.save();
                    ctx.translate(shapeX, shapeY);
                    ctx.rotate(shape.angle);

                    if (shape instanceof p2.Box) {

                        ctx.fillRect(shapeX - w/2, shapeY - h/2, w, h);
                        ctx.beginPath();
                        ctx.rect(shapeX - w/2, shapeY - h/2, w, h);
                        ctx.stroke();

                    } else if (shape instanceof p2.Circle) {

                        ctx.beginPath();
                        ctx.arc(shapeX, shapeY, shape.radius, 0, 2*Math.PI, false);
                        ctx.fill();
                        ctx.stroke();

                    }
                    ctx.restore();

                }
                ctx.rotate(-body.angle);  // reset context heading
                ctx.translate(-x, -y);

            }
            

        }

    }

}
