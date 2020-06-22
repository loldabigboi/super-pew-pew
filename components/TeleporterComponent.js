class TeleporterComponent extends Component {

    constructor(entityID, targetPosition, onTeleportCallback) {

        super(entityID);
        this.targetPosition = targetPosition;
        this.toBeTeleported = [];
        this.onTeleport = onTeleportCallback || function(){};  // called when entity is teleported

    }

}