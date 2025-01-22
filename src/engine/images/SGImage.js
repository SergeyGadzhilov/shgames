export class SGImage {
    constructor(src) {
        this.src = src;
        this.image = new Image();
        this.image.crossOrigin = "Anonymous";
    }

    async load() {
        return new Promise((resolve, reject) => {
            this.image.onload = () => {
                resolve();
            }
            this.image.onerror = () => {
                reject();
            }
            this.image.src = this.src;
        });
    }

    draw(display, rect) {
        display.drawImage(this.image, rect);
    }
}