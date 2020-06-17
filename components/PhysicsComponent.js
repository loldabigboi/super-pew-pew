class PhysicsComponent extends Component {

    constructor(entityID, bodyObj, shapeType, shapeObj) {

        super(entityID);

        this.body = new p2.Body(bodyObj);

        let shape;
        switch (shapeType) {
            case p2.Shape.CIRCLE:
                shape = new p2.Circle(shapeObj);
                break;
            case p2.Shape.BOX:
                shape = new p2.Box(shapeObj);
                break;
            case p2.Shape.PLANE:
                shape = new p2.Plane(shapeObj);
                break;
            default:
                throw new Error("shape type not supported atm");                         
        }

        this.body.addShape(shape);

    }

}

