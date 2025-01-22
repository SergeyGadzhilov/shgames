const CARD_VALUE_TEXT = [
    "",
    "",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A"
];

export class SGCardValue {
    constructor(settings) {
        this.text = CARD_VALUE_TEXT[settings.value];
        this.borders = settings.borders;
        this.suit = settings.suit;
    }

    draw(display) {
        display.drawText({
            text: this.text,
            x: this.borders.x,
            y: this.borders.y,
            color: this.suit.isBlack ? "#000000" : "#BC1E24"
        });
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
}