class FlyingEnemyAIComponent extends Component {

    constructor(entityID, trackingID, speed, startRadius=120, endRadius=160) {

        super(entityID);
        this.trackingID = trackingID;
        this.speed = speed;
        
        this.startRadius = startRadius;
        this.endRadius = endRadius;

    }

}