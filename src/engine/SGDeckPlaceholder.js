export class SGDeckPlaceholder {
    constructor(position) {
        this.position = {x: position.x, y: position.y, width: 100, height: 130};
    }

    draw(display) {
        display.roundRect({
            lineWidth: 3,
            color: "rgba(255,255,255,0.5)",
            background: "transparent",
            rectangle: this.position,
            radius: 5
        });
    }
}