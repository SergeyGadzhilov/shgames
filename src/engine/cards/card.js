import { SGRectangle } from "../sgrectangle.js";
import { SGCardSelection } from "./SGCardSelection.js";
import { CARD_SUITS } from "./SGCardSuit.js";

export const CARDS_VALUES = {
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10,
    JECK: 11,
    QUEEN: 12,
    KING: 13,
    ACE: 14
};

export class Card {
    constructor(settings) {
        this.suit = settings.suit;
        this.value = settings.value;
        this.back = settings.backImage;
        this.image = this.back;
        this.borders = new SGRectangle({x: 0, y: 0, width: 100, height: 130});
        this.front = settings.frontImage;
        this.selection = null;
        this.onUpdate();
    }

    select() {
        this.selection = new SGCardSelection();
    }

    unselect() {
        this.selection = null;
    }

    isSelected() {
        return this.selection != null;
    }

    isBlack() {
        return this.suit == CARD_SUITS.CLUBS || this.suit == CARD_SUITS.SPADES;
    }

    isOpen() {
        return this.image === this.front;
    }

    isClosed() {
        return !this.isOpen();
    }

    open() {
        this.image = this.front;
    }

    close() {
        this.image = this.back;
    }

    isInside(x, y) {
        return this.borders.isInside(x, y);
    }

    draw(display) {
        if (this.selection) {
            this.selection.draw(display, this.borders);
        }
        this.image.draw(display, this.borders);
    }

    onUpdate() {
        this.front.borders = this.borders;
        this.back.borders = this.borders;
    }

    set x(value) {
        this.borders.x = value;
        this.onUpdate();
    }

    get x() {
        return this.borders.x;
    }

    get y() {
        return this.borders.y;
    }

    set y(value) {
        this.borders.y = value;
        this.onUpdate();
    }

    get height() {
        return this.borders.height;
    }

    set height(value) {
        this.borders.height = value;
        this.onUpdate();
    }

    get width() {
        return this.borders.width;
    }

    set width(value) {
        this.borders.width = value;
        this.onUpdate();
    }
}