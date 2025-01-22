export class SGCardSelection {
    constructor(settings) {
        this.offset = settings?.offset ?? 2;
        this.color = settings?.collor ?? "#32BEFF";
    }

    draw(display, borders) {
        display.filter = "blur(2px)";
        display.stroke({
            lineWidth: 8,
            color: this.color,
            position: borders,
            size: borders
        });
        display.filter = 'none';
    }
}