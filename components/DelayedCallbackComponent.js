class DelayedCallbackComponent extends Component {

    constructor(entityID, delay, callback) {

        super(entityID);
        this.created = Date.now();
        this.delay = delay;
        this.callback = callback || Callbacks.DELETE_ENTITY;

    }

}