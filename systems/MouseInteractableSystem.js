class MouseInteractableSystem extends System {

    constructor() {
        super([MouseInteractableComponent, ShapeComponent]);
        
        this.lastMouse = {};
        Object.assign(this.lastMouse, InputManager.mouse);
    }

    addEntity(id, c) {

        if (!c[TransformComponent] && !c[PhysicsComponent]) {  // must have one of these
            return;
        }
        super.addEntity(id, c);

    }

    update(dt, entities, scene) {

        const mouse = InputManager.mouse;
        for (const entityID of Object.keys(this.entities)) {

            const c = this.entities[entityID];
            const mouseC = c[MouseInteractableComponent];
            const shapeC = c[ShapeComponent];
            const transC = c[TransformComponent];
            const physC = c[PhysicsComponent];

            let centerPos = ParentComponent.getAbsolutePosition(entityID, entities);
            const propOffset = shapeC.propOffset;
            let w, h;
            if (shapeC.type == p2.Shape.BOX) {
                w = shapeC.shape.width;
                h = shapeC.shape.height;
            } else if (shapeC.type == p2.Shape.CIRCLE) {
                w = shapeC.shape.radius;
                h = w;
            }
            p2.vec2.add(centerPos, centerPos, [(0.5-propOffset[0])*w, (0.5-propOffset[1])*h])

            const shape = shapeC.shape;
            const wasHovered = mouseC.hovered;
            if (shapeC.type == p2.Shape.BOX) {
                mouseC.hovered = !(mouse.x < centerPos[0] - shape.width/2  || mouse.x > centerPos[0] + shape.width/2 ||
                                   mouse.y < centerPos[1] - shape.height/2 || mouse.y > centerPos[1] + shape.height/2);
            } else if (shapeC.type == p2.Shape.CIRCLE) {
                mouseC.hovered = p2.vec2.sqrDist([mouse.x, mouse.y], centerPos) < shape.radius*shape.radius;
            }

            const obj = {
                id: entityID,
                scene: scene,
                components: c,
                mouse: mouse,
                lastMouse: this.lastMouse
            }
            if (wasHovered && !mouseC.hovered) {
                mouseC.onMouseLeave.forEach((callback) => callback(obj));
            } else if (!wasHovered && mouseC.hovered) {
                mouseC.onMouseEnter.forEach((callback) => callback(obj));
            }

            if (mouseC.hovered) {
                if (mouse.down && !this.lastMouse.down) {
                    mouseC.mouseWasDown = true;
                    mouseC.onMouseDown.forEach((callback) => callback(obj));
                } else {
                    if (!mouse.down) {
                        if (this.lastMouse.down) {
                            mouseC.onMouseUp.forEach((callback) => callback(obj));
                        }
                        if (mouseC.mouseWasDown) {
                            mouseC.onClick.forEach((callback) => callback(obj));
                        }
                        mouseC.mouseWasDown = false;
                    }
                }
            } else {
                mouseC.mouseWasDown = false;
            }

        }

        this.lastMouse = {};
        Object.assign(this.lastMouse, mouse);

    }

}