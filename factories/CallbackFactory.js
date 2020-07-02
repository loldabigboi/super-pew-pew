class CallbackFactory {

    static createEaseInOutFn(a) {
        return (x) => {
            const pow = Math.pow(x, a);
            return pow / (pow + Math.pow((1-x), 2));
        };
    }

    static createEaseOutFn(a) {
        const easeInOutFn = CallbackFactory.createEaseInOutFn(a);
        return (x) => 2*easeInOutFn(0.5*x);
    }

    static createEaseInFn(a) {
        const easeInOutFn = CallbackFactory.createEaseInOutFn(a);
        return (x) => 2*easeInOutFn(0.5 + 0.5*x) - 1;
    }

    static createFnAttributeModifier(fn, component, attributeNames, amplitude, dx, offset=0) {

        // traverse references to reach final reference (i.e. value that is not a number)
        let ref = component;
        const identifier = attributeNames[attributeNames.length-1];
        for (let i = 0; i < attributeNames.length-1; i++) {
            ref = ref[attributeNames[i]];
        }

        let y = 0;

        let x = offset;
        return () => {

            // may look weird, but its done like this so if the 'actual' value of the component attribute (without fn value added) changes during the lifetime
            // of this callback, it doesn't matter
            ref[identifier] -= y;
            y = fn(x)*amplitude;
            ref[identifier] += y;
            x += dx;

            return {
                x: x,
                y: ref[identifier],
                initVal: ref[identifier] - y,
                ref: ref,
                identifier: identifier
            };
        }

    }

    static attachSelfDestructThreshold(fnCallback, containingArray, thresholdType, threshold, resetValue=true, onSelfDestruct=()=>{}) {

        return function() {
            const obj = fnCallback();
            if (obj[thresholdType] > threshold) {
                onSelfDestruct();
                obj.ref[obj.identifier] = resetValue ? obj.initVal : obj.ref[obj.identifier];
                containingArray.splice(containingArray.indexOf(this), 1);
            }
        }

    }

}