class ShapeComponent extends Component {

    constructor(entityID, type, options, absOffset, propOffset, angle, material, body) {

        super(entityID);
        this.type = type;
        this.absOffset = absOffset;  // offset relative to body
        this.propOffset = propOffset;
        switch (type) {
            case p2.Shape.BOX:
                this.shape = new p2.Box(options);
                break;
            
            case p2.Shape.CIRCLE:
                this.shape = new p2.Circle(options);
                break;

            case p2.Shape.CAPSULE:
                this.shape = new p2.Capsule(options);
                break;

            case p2.Shape.LINE:
                this.shape = new p2.Line(options);
                break;

            case p2.Shape.PLANE:
                this.shape = new p2.Plane(options);
                break;

            default:
                throw new Error(`shape type ${type} not supported`);
        }
        this.shape.material = material;
        if (body) {
            this.body = body;
            body.addShape(this.shape, absOffset, angle);
        }
        
    }

}

ShapeComponent.TOP_LEFT      = [ 0   , 0   ];
ShapeComponent.TOP_CENTER    = [-0.5,  0  ];
ShapeComponent.TOP_RIGHT     = [-1  ,  0  ];
ShapeComponent.CENTER_LEFT   = [ 0  , -0.5];
ShapeComponent.CENTER        = [-0.5, -0.5];
ShapeComponent.CENTER_RIGHT  = [-1  , -0.5];
ShapeComponent.BOTTOM_LEFT   = [ 0  , -1  ];
ShapeComponent.BOTTOM_CENTER = [-0.5, -1  ];
ShapeComponent.BOTTOM_RIGHT  = [-1  , -1  ];