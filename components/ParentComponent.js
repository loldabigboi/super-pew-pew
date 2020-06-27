class ParentComponent extends Component {

    constructor(entityID, parentID, flatOffset, propOffset, onParentDeletion) {

        super(entityID);
        this.parentID = parentID;
        this.flatOffset = flatOffset;
        this.propOffset = propOffset;
        this.onParentDeletion = onParentDeletion || Callbacks.DELETE_ENTITY;
        
    }

    static getAbsolutePosition(id, entities, propOffset=[0,0]) {

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
                p2.vec2.add(pos, pos, nodeC[PhysicsComponent].body.position);
            } else if (nodeC[TransformComponent]) {
                p2.vec2.add(pos, pos, nodeC[TransformComponent].position);
            }

            const shapeC = nodeC[ShapeComponent];
            if (i == 0 && shapeC) {
                const offset = shapeC.flatOffset.slice();
                let w, h;
                if (shapeC.type == p2.Shape.BOX) {
                    w = shapeC.shape.width;
                    h = shapeC.shape.height; 
                } else {
                    w = shapeC.shape.radius;
                    h = shapeC.shape.radius;
                }
                p2.vec2.add(offset, offset, [(propOffset[0]-shapeC.propOffset[0])*w, 
                                             (propOffset[1]-shapeC.propOffset[1])*h]);
                p2.vec2.add(pos, pos, offset)
            }

            if (i+1 < tree.length) {
                const pComp = nodeC[ParentComponent];
                p2.vec2.add(pos, pos, pComp.flatOffset);
                if (pComp.propOffset[0] != 0 || pComp.propOffset[1] != 0) {
                    const parentShapeC = tree[i+1][ShapeComponent];
                    if (parentShapeC) {
                        if (parentShapeC.type == p2.Shape.BOX) {
                            p2.vec2.add(pos, pos, [parentShapeC.shape.width * pComp.propOffset[0], 
                                parentShapeC.shape.height * pComp.propOffset[1]]);
                        } else if (parentShapeC.type == p2.Shape.CIRCLE) {
                            p2.vec2.add(pos, pos, [parentShapeC.shape.radius * pComp.propOffset[0], 
                                parentShapeC.shape.radius * pComp.propOffset[1]]);
                        }
                    }

                }

            }


        }

        return pos;

    }

}