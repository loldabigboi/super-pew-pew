class Component {

    constructor(entityID) {
        this.id = Component.CURR_ID++;
        this.entityID = entityID;
    }

}
Component.CURR_ID = 0;

