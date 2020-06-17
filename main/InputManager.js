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
        keyDown: [],
        keyUp: [],
        keyTyped: [],
        mouseDown: [],
        mouseUp: [],
        mouseClicked: []
    }

    static fromChar(c) {

        const character = c.toLowerCase();
        if (character.match(/^[a-z]$/)) {
            return character.charCodeAt(0) - 32;
        } else if (character.match(/^[0-9]$/)) {
            return parseInt(character);
        } else {
            throw new Error(`character '${character}' not alphanumerical.`);
        }

    }

    static keyDown(keyCode) {
        return InputManager.key[keyCode].down;
    }

    static keyTyped(keyCode) {
        return InputManager.key[keyCode].typed;
    }

}

for (let keycode = 0; keycode < 256; keycode++) {
    InputManager.key[keycode] = {
        down: false,
        typed: false,
        lastDown: 0,
        lastUp: 0,
        lastTyped: 0,
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

})

canvas.addEventListener('keypress', (e) => {  // keydown followed by keyup

    // dont need to handle setting keyEntry.down to false etc. as this will be done by the keyup listener 
    
    const keyEntry = InputManager.key[e.keyCode];
    const now = Date.now();
    keyEntry.lastTyped = now;
    keyEntry.typed = true;

})

canvas.addEventListener('keyup', (e) => {
    
    const keyEntry = InputManager.key[e.keyCode];
    const now = Date.now();
    keyEntry.down = false;
    keyEntry.typed = false;
    keyEntry.lastReleased = now;

})

/* CANVAS MOUSE EVENT LISTENERS */
canvas.addEventListener('mousemove', (e) => {

    const rect = canvas.getBoundingClientRect();

    InputManager.mouse.prevX = InputManager.mouse.x;
    InputManager.mouse.prevY = InputManager.mouse.y;

    // relative mouse x and y
    InputManager.mouse.x = e.clientX - rect.left;
    InputManager.mouse.y = e.clientY - rect.top;

})

canvas.addEventListener('mousedown', (e) => {
    const now = Date.now();
    InputManager.mouse.down = true;
    InputManager.mouse.lastDown = now;
})

canvas.addEventListener('mouseup', (e) => {
    const now = Date.now();
    InputManager.mouse.down = false;
    InputManager.mouse.lastUp = now;
})

canvas.addEventListener('click', (e) => {
    const now = Date.now();
    InputManager.mouse.down = true;
    InputManager.mouse.lastDown = now;
})