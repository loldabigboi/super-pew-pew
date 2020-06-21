class PhysicsComponent extends Component {

    constructor(entityID, bodyOptions, shapeComps) {

        super(entityID);

        this.body = new p2.Body(bodyOptions);
        this.body.id = entityID;
        
        this.shapeComps = shapeComps;
        shapeComps.forEach((shapeComp) => {
            shapeComp.body = this.body;
            this.body.addShape(shapeComp.shape, shapeComp.absOffset, shapeComp.angle)
        });

    }

}

