class ParentComponent extends Component {

    constructor(entityID, parentID, flatOffset, propOffset, onParentDeletion) {

        super(entityID);
        this.parentID = parentID;
        this.flatOffset = flatOffset;
        this.propOffset = propOffset;
        this.onParentDeletion = onParentDeletion || Callbacks.DELETE_ENTITY;
        
    }

    static getAbsolutePosition(id, entities) {

        let current = entities[id];
        let tree = [current];
        while (current[ParentComponent]) {
            current = entities[current[ParentComponent].parentID];
            tree.push(current);
        }

        let pos = [0, 0];
        for (let i = 0; i < tree.length; i++) {
            const nodeC = tree[i];

            if (nodeC[PhysicsComponent]) {
                pos = p2.vec2.add(pos, pos, nodeC[PhysicsComponent].body.position);
            } else if (nodeC[TransformComponent]) {
                pos = p2.vec2.add(pos, pos, nodeC[TransformComponent].position);
            }

            if (i+1 < tree.length) {
                const pComp = nodeC[ParentComponent];
                pos = p2.vec2.add(pos, pos, pComp.flatOffset);
                if (pComp.propOffset[0] != 0 || pComp.propOffset[1] != 0) {
                    const parentShapeC = tree[i+1][ShapeComponent];
                    if (parentShapeC) {
                        if (parentShapeC.type == p2.Shape.BOX) {
                            pos = p2.vec2.add(pos, pos, [parentShapeC.shape.width * pComp.propOffset[0], 
                                parentShapeC.shape.height * pComp.propOffset[1]]);
                        } else if (parentShapeC.type == p2.Shape.CIRCLE) {
                            pos = p2.vec2.add(pos, pos, [parentShapeC.shape.radius * pComp.propOffset[0], 
                                parentShapeC.shape.radius * pComp.propOffset[1]]);
                        }
                    }

                }

            }


        }

        return pos;

    }

}