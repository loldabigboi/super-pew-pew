class CallbackFactory {

    /**
     * Creates a callback that oscillates the numeric value of a component's attribute.
     * @param {*} component Component that has an attribute being oscillated
     * @param {*} attributeNames Array of attribute identifiers, corresponding to layers of references. 
     * For instance, for accessing the x component of a TransformComponent's position pass ['position', '0']
     * @param {*} amplitude Maximum 'distance' of oscillation from initial value
     * @param {*} dRate Rate of change of 'speed'
     * @param {*} damping Damping coefficient
     */
    static createOscillatorCallback(component, attributeNames, amplitude, dRate, damping, numOscillations=Infinity, onFinish=()=>{}) {

        let rate = 0;
        let dir = 1;

        // traverse references to reach final reference (i.e. value that is not a number)
        let ref = component;
        const identifier = attributeNames[attributeNames.length-1];
        for (let i = 0; i < attributeNames.length-1; i++) {
            ref = ref[attributeNames[i]];
        }

        let initVal = ref[identifier];
        let lastVal;
        let dirChanged = false;

        let currOscillation = 0;

        return (obj) => {

            rate = (rate + dRate*dir)*damping;

            lastVal = ref[identifier];
            ref[identifier] += rate;
            if (Math.abs(ref[identifier] - initVal) > amplitude) {
                if (!dirChanged) {
                    dir *= -1;
                    dirChanged = true;
                }
            } else {
                if (Math.sign(lastVal - initVal) != Math.sign(ref[identifier] - initVal)) {
                    currOscillation += 0.5;
                    if (currOscillation > numOscillations) {
                        onFinish({
                            callbackComp: this
                        });
                    }
                    dirChanged = false;
                }
            }

        }

    }

}