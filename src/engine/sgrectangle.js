export class SGRectangle {
    constructor(options) {
        this.position = {x: options.x, y: options.y};
        this.size = {width: options.width, height: options.height};
    }

    isInside(x, y) {
        if (x >= this.position.x && x <= this.position.x + this.size.width && 
            y >= this.position.y && y <= this.position.y + this.size.height) {
            return true;
        }
        return false;
    }

    hasCollision(rect) {
        return this.isInside(rect.x, rect.y) ||
               this.isInside(rect.x + rect.width, rect.y) ||
               this.isInside(rect.x, rect.y + rect.height) ||
               this.isInside(rect.x + rect.width, rect.y + rect.height);
    }

    get x() {
        return this.position.x;
    }

    set x(value) {
        this.position.x = value;
    }

    get y() {
        return this.position.y;
    }

    set y(value) {
        this.position.y = value
    }

    get width() {
        return this.size.width;
    }

    set width(value) {
        this.size.width = value;
    }

    get height() {
        return this.size.height;
    }

    set height(value) {
        this.size.height = value;
    }
}