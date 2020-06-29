class ResourceManager {

    static loadedResources = {};
    static loadingCount = 0;

    static loadImage(id, relPath) {

        const imageObj = new Image();
        imageObj.src = relPath;
        
        ResourceManager.loadingCount++;
        imageObj.onload(() => ResourceManager.loadingCount--);

        this.loadedResources[id] = imageObj;

    }

    static getResource(id) {
        return ResourceManager.loadedResources[id];
    }

}