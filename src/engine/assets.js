import { SGImage } from "./images/sgimage";

class Assets {
    constructor() {
        this.images = new Map();
    }

    async loadImages(images) {
        var promisses = [];
        images.forEach(element => {
            var image = new SGImage(element);
            this.images.set(element, image);
            promisses.push(image.load());
        });
        return Promise.all(promisses);
    }

    getImage(image) {
        return this.images.get(image);
    }
}

export const assets = new Assets();