class TrackingComponent extends Component {

    constructor(id, trackingID, relOffset, absOffset, trackScale, onTrackDeletionCallback) {

        super(id);
        this.trackingID = trackingID;
        this.relOffset = relOffset;
        this.absOffset = absOffset;
        this.trackScale = trackScale;  // useful for parallax effect
        this.onTrackDeletion = onTrackDeletionCallback || (() => {});  // called when the tracked entity is deleted

    }

}