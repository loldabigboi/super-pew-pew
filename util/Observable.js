class Observable {

    constructor(value, changeListeners=[]) {
        this.changeListeners = changeListeners instanceof Array ? changeListeners : [changeListeners];
        this._value = value;
    }

    addChangeListener(listener) {
        this.changeListeners.push(listener);
    }

    removeChangeListener(listener) {
        this.changeListeners.splice(this.changeListeners.indexOf(listener), 1);
    }

    set value(newVal) {
        this.changeListeners.forEach((listener) => listener(this.value, newVal));
        this._value = newVal;
    }
    
    get value() {
        return this._value;
    }

}