export class SGDraggable extends EventTarget {
    constructor(obj, cursor, source) {
        super();
        this.source = source;
        this.obj = obj;
        this.offset = {
            x: cursor.x - obj.x,
            y: cursor.y - obj.y
        };
    }

    onMouseMove(event) {
        this.obj.x = event.x - this.offset.x;
        this.obj.y = event.y - this.offset.y;
        this.dispatchEvent(new CustomEvent("dragevent"));
        return true;
    }

    onMouseUp() {
        this.dispatchEvent(new CustomEvent("stopdragging", {detail: this}));
        return true;
    }

    draw(display) {
        this.obj.draw(display);
    }
}