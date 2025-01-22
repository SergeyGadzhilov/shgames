export const CARD_SUITS = {
    HEARTS: 0,
    CLUBS: 1,
    DIAMONDS: 2,
    SPADES: 3
};

export class SGCardSuit{
    constructor(options) {
        this.suit = options.suit;
        this.image = options.image;
    }

    get isBlack() {
        return this.suit == CARD_SUITS.SPADES || this.suit == CARD_SUITS.CLUBS;
    }

    draw(display) {
        this.image.draw(display);
    }

    get x() {
        return this.image.x;
    }

    set x(value) {
        this.image.x = value;
    }

    get y() {
        return this.image.y;
    }

    set y(value) {
        this.image.y = value;
    }
}