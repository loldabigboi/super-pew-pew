class ResourceManager {

    static loadedResources = {};

    static loadImages(infoArr, onload) {

        // used to call callback once all img.onload callbacks have executed
        const counter = {
            count: 0,
            decrement: function() {
                if (--this.count == 0) {
                    onload();
                }
            } 
        }

        for (const obj of infoArr) {
            const imgObj = new Image();
            imgObj.src = obj.src;
            counter.count++;
            imgObj.onload = () => {
                counter.decrement(onload);
            }
            ResourceManager.loadedResources[obj.id] = imgObj;
        }

    }

    static getResource(id) {
        return ResourceManager.loadedResources[id];
    }

}