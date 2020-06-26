class MouseInteractableComponent extends Component {

    /**
     * 
     * @param {*} entityID 
     * @param {*} callbacks Object containing arrays of listeners for different types of events
     */
    constructor(entityID, callbacks) {

        super(entityID);

        this.hovered = false;
        this.mouseWasDown = false;  // whether mouse was down on this entity on last update (used for click event)

        this.onMouseEnter = callbacks.onMouseEnter || [];
        if (!(this.onMouseEnter) instanceof Array) {
            this.onMouseEnter = [this.onMouseEnter];
        }

        this.onMouseLeave = callbacks.onMouseLeave || [];
        if (!(this.onMouseLeave) instanceof Array) {
            this.onMouseLeave = [this.onMouseLeave];
        }

        this.onMouseDown = callbacks.onMouseDown || [];
        if (!(this.onMouseDown) instanceof Array) {
            this.onMouseDown = [this.onMouseDown];
        }

        this.onMouseUp = callbacks.onMouseUp || [];
        if (!(this.onMouseUp) instanceof Array) {
            this.onMouseUp = [this.onMouseUp];
        }

        this.onClick = callbacks.onClick || [];
        if (!(this.onClick) instanceof Array) {
            this.onClick = [this.onClick];
        }


    }

}