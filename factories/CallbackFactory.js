class CallbackFactory {

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

            // may look weierd, but its done like this so if the 'actual' value of the component attribute (without fn value added) changes during the lifetime
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

    static attachSelfDestructThreshold(fnCallback, containingArray, thresholdType, threshold) {

        return function() {
            const obj = fnCallback();
            if (obj[thresholdType] > threshold) {
                obj.ref[obj.identifier] = obj.initVal;
                containingArray.splice(containingArray.indexOf(this), 1);
            }
        }

    }

}