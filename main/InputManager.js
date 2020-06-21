class InputManager {
    
    static key = {};

    static mouse = {

        x: 0,
        prevX: 0,
        y: 0,
        prevY: 0,

        down: false,
        clicked: false,
        lastDown: 0,
        lastUp: 0,
        lastClicked: 0

    }

    static listeners = {
        keydown: [],
        keyup: [],
        keypress: [],
        mousemove: [],
        mousedown: [],
        mouseup: [],
        click: []
    }

    static fromChar(c) {

        const character = c.toLowerCase();
        if (character.match(/^[a-z]$/)) {
            return InputManager.key[character.charCodeAt(0) - 32];
        } else if (character.match(/^[0-9]$/)) {
            return InputManager.key[parseInt(character)];
        } else {
            throw new Error(`character '${character}' not alphanumerical.`);
        }

    }

    /**
     * Adds a listener for a specific type of input event
     * @param {string} type Input event type, e.g. keydown, keypress, mousedown etc. (see InputManager)
     * @param {number} id Id used to uniquely identify each listener to enable future removal (without need for preserving callback)
     * @param {function} listenerFunc Called with two arguments: the relevant input object (InputManager.mouse/key[keycode]), and the event object itself
     */
    static addListener(type, id, listenerFunc) {
        InputManager.listeners[type].push({
            id: id,
            func: listenerFunc
        });
    }

}
InputManager.CURRENT_ID = 0;
InputManager.GENERATE_ID = () => InputManager.CURRENT_ID++;

for (let keycode = 0; keycode < 256; keycode++) {
    InputManager.key[keycode] = {
        code: keycode,
        down: false,
        pressed: false,
        lastDown: 0,
        lastUp: 0,
        lastPressed: 0,
    }
}

// keycode constants
InputManager.TAB = 9;
InputManager.RETURN = 13;
InputManager.SHIFT = 16;
InputManager.CONTROL = 17;
InputManager.ALT = 18;
InputManager.CAPSLOCK = 20;
InputManager.SPACE = 32;
InputManager.SEMICOLON = 186;
InputManager.EQUAL = 187;
InputManager.COMMA = 188;
InputManager.MINUS = 189;
InputManager.PERIOD = 190;
InputManager.SLASH = 191;
InputManager.BQUOTE = 192;
InputManager.LBRACKET = 219;
InputManager.BSLASH = 220;
InputManager.RBRACKET = 221;
InputManager.APOSTROPHE = 222;

const canvas = document.getElementById("canvas");

/* CANVAS KEY EVENT LISTENERS */
canvas.addEventListener('keydown', (e) => {
    
    const keyEntry = InputManager.key[e.keyCode];
    const now = Date.now();
    keyEntry.down = true;
    keyEntry.lastDown = now;

    InputManager.listeners.keydown.forEach((listener) => listener.func(keyEntry, e));

});

canvas.addEventListener('keypress', (e) => {  // keydown followed by keyup

    // dont need to handle setting keyEntry.down to false etc. as this will be done by the keyup listener 

    const keyEntry = InputManager.key[e.keyCode];
    const now = Date.now();
    keyEntry.lastPressed = now;
    keyEntry.pressed = true;

    InputManager.listeners.keypress.forEach((listener) => listener.func(keyEntry, e));

});

canvas.addEventListener('keyup', (e) => {
    
    const keyEntry = InputManager.key[e.keyCode];
    const now = Date.now();
    keyEntry.down = false;
    keyEntry.pressed = false;
    keyEntry.lastReleased = now;

    InputManager.listeners.keyup.forEach((listener) => listener.func(keyEntry, e));

});

/* CANVAS MOUSE EVENT LISTENERS */
canvas.addEventListener('mousemove', (e) => {

    const rect = canvas.getBoundingClientRect();

    InputManager.mouse.prevX = InputManager.mouse.x;
    InputManager.mouse.prevY = InputManager.mouse.y;

    // relative mouse x and y
    InputManager.mouse.x = e.clientX - rect.left;
    InputManager.mouse.y = e.clientY - rect.top;

    InputManager.listeners.mousemove.forEach((listener) => listener.func(InputManager.mouse, e));

});

canvas.addEventListener('mousedown', (e) => {
    const now = Date.now();
    InputManager.mouse.down = true;
    InputManager.mouse.lastDown = now;

    InputManager.listeners.mousemove.forEach((listener) => listener.func(InputManager.mouse, e));

});

canvas.addEventListener('mouseup', (e) => {
    const now = Date.now();
    InputManager.mouse.down = false;
    InputManager.mouse.lastUp = now;

    InputManager.listeners.mouseup.forEach((listener) => listener.func(InputManager.mouse, e));
});

canvas.addEventListener('click', (e) => {
    const now = Date.now();
    InputManager.mouse.down = true;
    InputManager.mouse.lastDown = now;
    
    InputManager.listeners.click.forEach((listener) => listener.func(InputManager.mouse, e));
});