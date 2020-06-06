class PhysicsComponent extends Component {

    constructor(entityID, mass, xPos, yPos, xVel, yVel, shapeObj) {

        super(entityID);

        this.body = new p2.Body({
            mass: mass,
            position: [xPos, yPos],
            velocity: [xVel, yVel],
            id: entityID
        });

        let shape;
        if (shapeObj.type === PhysicsComponent.CIRCLE) {
            shape = new p2.Circle({
                radius: shapeObj.radius
            })
        } else if (shapeObj.type === PhysicsComponent.RECTANGLE) {
            shape = new p2.Box({
                width: shapeObj.width,
                height: shapeObj.height
            })
        } else {
            throw new Error("shape type not supported atm");
        }

        this.body.addShape(shape);

    }

}

PhysicsComponent.CIRCLE = 0;
PhysicsComponent.RECTANGLE = 1;