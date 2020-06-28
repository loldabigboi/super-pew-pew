class CallbackFactory {

    static createFnAttributeModifier(fn, component, attributeNames, amplitude, dx, offset=0) {

        // traverse references to reach final reference (i.e. value that is not a number)
        let ref = component;
        const identifier = attributeNames[attributeNames.length-1];
        for (let i = 0; i < attributeNames.length-1; i++) {
            ref = ref[attributeNames[i]];
        }

        let initVal = ref[identifier];

        let x = offset;
        return () => {
            ref[identifier] = initVal + fn(x) * amplitude;
            x += dx;
            return {
                x: x,
                y: ref[identifier],
                initVal: initVal,
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