export class SGResizableImage {
    constructor(options) {
        this.image = options.image;
        this.borders = options.borders;
    }

    draw(display) {
        this.image.draw(display, this.borders);
    }

    get x() {
        return this.borders.x;
    }

    set x(value) {
        this.borders.x = value;
    }

    get y() {
        return this.borders.y;
    }

    set y(value) {
        this.borders.y = value;
    }

    get width() {
        return this.borders.width;
    }

    set width(value) {
        this.borders.width = value;
    }

    get height() {
        return this.borders.height;
    }

    set height(value) {
        this.borders.height = value;
    }
}