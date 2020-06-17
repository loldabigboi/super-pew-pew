/**
 * Effectively just a wrapper for a callback that should be executed once every game loop.
 * Will rarely be required, but is useful for player movement (setting vel. to certain value every loop while
 * key pressed).
 */
class LoopCallbackComponent extends Component {

    /**
     * 
     * @param {*} id 
     * @param {*} callback Takes the dictionary of components for this entity as input.
     */
    constructor(id, callback) {
        super(id);
        this.callback = callback;
    }

}