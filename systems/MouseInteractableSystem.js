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
        let currLayer;
        for (const entityID of Object.keys(this.entities).sort((idA, idB) => {
            return this.entities[idB][MouseInteractableComponent].layer - 
                   this.entities[idA][MouseInteractableComponent].layer;
        })) {

            const c = this.entities[entityID];
            const mouseC = c[MouseInteractableComponent];
            const shapeC = c[ShapeComponent];
            const shape = shapeC.shape;

            let centerPos = ParentComponent.getAbsolutePosition(entityID, entities, [0,0]);
            let overlaps = (shapeC.type == p2.Shape.BOX && !(mouse.x < centerPos[0] - shape.width/2  || mouse.x > centerPos[0] + shape.width/2 ||
                                                             mouse.y < centerPos[1] - shape.height/2 || mouse.y > centerPos[1] + shape.height/2))


            if (!ParentComponent.getInheritedValue(entityID, entities, MouseInteractableComponent, 'interactable') || 
                (currLayer != undefined && mouseC.layer != currLayer)) {
                overlaps = false;
            }
            
            if (overlaps) {

                if ((mouse.x != mouse.prevX || mouse.y != mouse.prevY) &&
                    mouseC.listeners.mousemove) {
                    mouseC.listeners.mousemove.forEach((listener) => {
                        listener({
                            mouse: mouse,
                            mouseC: mouseC,
                            lastMouse: this.lastMouse,
                            components: c,
                            id: entityID,
                            scene: scene
                        });
                    })
                }

                if (!mouseC.hovered) {
                    if (mouseC.listeners.mouseenter) {
                        mouseC.listeners.mouseenter.forEach((listener) => {
                            listener({
                                mouse: mouse,
                                mouseC: mouseC,
                                lastMouse: this.lastMouse,
                                components: c,
                                id: entityID,
                                scene: scene
                            });
                        })
                    }
                }

                if (!this.lastMouse.down && mouse.down) {
                    if (mouseC.listeners.mousedown) {
                        mouseC.listeners.mousedown.forEach((listener) => {
                            listener({
                                mouse: mouse,
                                mouseC: mouseC,
                                lastMouse: this.lastMouse,
                                components: c,
                                id: entityID,
                                scene: scene
                            });
                        })
                    }
                } else if (this.lastMouse.down && !mouse.down) {
                    if (mouseC.listeners.mouseup) {
                        mouseC.listeners.mouseup.forEach((listener) => {
                            listener({
                                mouse: mouse,
                                mouseC: mouseC,
                                lastMouse: this.lastMouse,
                                components: c,
                                id: entityID,
                                scene: scene
                            });
                        })
                    }
                }

                currLayer = mouseC.layer;

                mouseC.mouse = {
                    prevX: mouseC.mouse.x,
                    prevY: mouseC.mouse.y,
                    x: mouse.x,
                    y: mouse.y,
                }

            } else {

                if (mouseC.hovered) {
                    if (mouseC.listeners.mouseleave) {
                        mouseC.listeners.mouseleave.forEach((listener) => {
                            listener({
                                mouse: mouse,
                                mouseC: mouseC,
                                lastMouse: this.lastMouse,
                                components: c,
                                id: entityID,
                                scene: scene
                            });
                        })
                    }
                }

            }

            mouseC.hovered = overlaps;
                
        }

        this.lastMouse = {};
        Object.assign(this.lastMouse, mouse);

    }

}