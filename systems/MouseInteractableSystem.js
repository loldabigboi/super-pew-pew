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

            let centerPos;
            if (physC) {
                centerPos = physC.body.position;
            } else {
                const pos = transC.position;
                if (shapeC.type == p2.Shape.BOX) {
                    p2.vec2.add(pos, pos, [-shapeC.shape.width/2, -shapeC.shape.height/2]);
                } else if (shapeC.type == p2.Shape.CIRCLE) {
                    // circles are already centered
                } else {
                    throw new Error("invalid shape type");
                }
            }

            const shape = shapeC.shape;
            const wasHovered = mouseC.hovered;
            if (shapeC.type == p2.Shape.BOX) {
                mouseC.hovered = !(mouse.x < centerPos - shape.width/2  || mouse.x > centerPos + shape.width/2 ||
                                   mouse.y < centerPos - shape.height/2 || mouse.y > centerPos + shape.height/2);
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
                    if (!mouse.down && this.lastMouse.down) {
                        if (mouseC.mouseWasDown) {
                            mouseC.onClick.forEach((callback) => callback(obj));
                        }
                        mouseC.onMouseUp.forEach((callback) => callback(obj));
                    }
                    mouseC.mouseWasDown = false;
                }
            } else {
                mouseC.mouseWasDown = false;
            }

        }

        this.lastMouse = {};
        Object.assign(this.lastMouse, mouse);

    }

}