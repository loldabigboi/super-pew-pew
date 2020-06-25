class RepeatingCallbackComponent extends Component {

    constructor(entityID, interval, callback) {

        super(entityID);
        this.interval = interval;
        this.lastCalled = Date.now();
        this.callback = callback;

    }

}