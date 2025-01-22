import { SGCardSuit } from "./SGCardSuit";
import { SGCardValue } from "./SGCardValue";

export class SGCardImage {
    constructor(settings) {
        this.smallOffset = {x: 70, y: 10};
        this.bigOffset = {x: 12, y: 45};
        this.textOffset = {x: 10, y: 30};
        this._borders = settings.borders;

        this.smallImage = new SGCardSuit({
            suit: settings.suit,
            image: settings.smallImage
        });

        this.bigImage = new SGCardSuit({
            suit: settings.suit,
            image: settings.bigImage
        });

        this.text = new SGCardValue({
            value: settings.value,
            suit: this.smallImage,
            borders: this._borders
        });
    }

    update(settings) {
        this._borders = settings;
        this.smallImage.x = settings.x + this.smallOffset.x;
        this.smallImage.y = settings.y + this.smallOffset.y;
        this.bigImage.x = settings.x + this.bigOffset.x;
        this.bigImage.y = settings.y + this.bigOffset.y;
        this.text.x = settings.x + this.textOffset.x;
        this.text.y = settings.y + this.textOffset.y;
    }

    draw(display) {
        display.roundRect({color: "#000000", background: "white", rectangle: this.borders, radius: 5});
        this.text.draw(display);
        this.smallImage.draw(display);
        this.bigImage.draw(display);
    }

    get borders() {
        return this._borders;
    }

    set borders(value) {
        this.update(value);
    }
}