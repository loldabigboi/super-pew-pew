class ShapeComponent extends Component {

    constructor(entityID, type, options, flatOffset, propOffset, angle, collisionGroup, collisionMask, skipResolveMask, material, body) {

        super(entityID);
        
        this.flatOffset = flatOffset;  // offset relative to body
        this.propOffset = propOffset;

        this.type = type;
        this.options = options;

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
        this.shape.collisionGroup = collisionGroup;
        this.shape.collisionMask = collisionMask;

        // used to still generate contact events between entities, but have the collision not be resolved
        // (i.e. they dont physically affect each other)
        this.shape.skipResolveMask = skipResolveMask;

        if (body) {
            this.body = body;
            body.addShape(this.shape, flatOffset, angle);
        }
        
    }

}

ShapeComponent.GROUPS = {
    PLAYER: Math.pow(2, 0),
    GROUND: Math.pow(2, 1),
    ENEMY:  Math.pow(2, 2),
    PROJ:   Math.pow(2, 3),
    TELE:   Math.pow(2, 4),
    PICKUP: Math.pow(2, 5)
}

const g = ShapeComponent.GROUPS;
ShapeComponent.MASKS = {
    PLAYER: g.ENEMY | g.GROUND | g.TELE | g.PICKUP,
    GROUND: g.PLAYER | g.ENEMY  | g.PROJ | g.PICKUP,
    ENEMY:  g.PLAYER | g.PROJ | g.GROUND | g.TELE,
    PROJ:   g.ENEMY | g.GROUND | g.TELE,
    PICKUP: g.PLAYER | g.GROUND
}