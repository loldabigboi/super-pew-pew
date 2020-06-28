class MouseInteractableComponent extends Component {

    /**
     * 
     * @param {*} entityID 
     * @param {*} callbacks Object containing arrays of listeners for different types of events
     */
    constructor(entityID, listeners, layer=0) {

        super(entityID);

        this.interactable = true;  // flag that can be set to false to ignore mouse interactions

        this.wasHovered = false;
        this.hovered = false;

        this.mouse = {

            x: 0,
            prevX: 0,
            y: 0,
            prevY: 0,
    
            down: false,
            lastDown: 0,
            lastUp: 0
    
        };

        this.listeners = listeners;

        const listenerNames = ['mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave'];
        listenerNames.forEach((name) => {
            if (this.listeners[name]) {
                if (!(this.listeners[name] instanceof Array)) {
                    this.listeners[name] = [this.listeners[name]];
                }
            } else {
                this.listeners[name] = [];
            }   
        })

        this.layer = layer;

    }

}