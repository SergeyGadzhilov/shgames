import { SGDeckPlaceholder } from "./SGDeckPlaceholder.js";
import { SGRectangle } from "./sgrectangle.js";

export class Deck extends EventTarget {
    constructor(settings) {
        super();
        this.id = settings.id;
        this.cards = [];
        this.showPlaceholder = settings.showPlaceholder ?? true;
        this.placeholder = new SGDeckPlaceholder(settings.position);
        this.borders = new SGRectangle(this.placeholder.position);
        this.offset = settings.offset ?? 0;
    }

    select() {
        this.cards.forEach(card => card.select());
    }

    unselect() {
        this.cards.forEach(card => card.unselect());
    }

    popSelectedDeck() {
        const deck = new Deck({
            position: {x: this.x, y: this.y},
            offset: this.offset
        });
        
        let last = this.pop();
        if (!last) {
            return deck;
        }

        while(last && last.isSelected()) {
            deck.unshift(last);
            last = this.pop();
        }

        if (last ) {
            this.add(last);
        }

        return deck;
    }

    isEmpty() {
        return this.cards.length == 0;
    }

    hasClosedCards() {
        for(let i = 0; i < this.cards.length; ++i) {
            if (this.cards[i].isClosed()) {
                return true;
            }
        }
        return false;
    }

    getCardByPosition(position) {
        return this.cards.findLast((card) => card.isInside(position.x, position.y));
    }

    async onMouseDown(event) {
        if (this.borders.isInside(event.x, event.y)) {
            this.dispatchEvent(new CustomEvent("ondeckselect", {detail: {deck: this, cursor: event}}));
            return true;
        }
        return false;
    }

    addDeck(deck) {
        deck.cards.forEach(card => {
            this.add(card);
        });
    }

    popDeck(x, y) {
        const deck = new Deck({
            position: {x: this.x, y: this.y},
            offset: this.offset
        });

        let last = this.pop();
        if (!last) {
            return deck;
        }

        if (last.isInside(x, y)) {
            deck.x = last.x;
            deck.y = last.y;
            deck.add(last);
            return deck;
        }

        while(last && !last.isInside(x, y)) {
            deck.unshift(last);
            last = this.pop();
        }

        if (last) {
            deck.x = last.x;
            deck.y = last.y;
            deck.unshift(last);
        }

        return deck;
    }

    getCardOffset() {
        if (!this.isEmpty()) {
            return this.lastCard.isOpen() ? this.offset : this.offset / 3;
        }
        return 0;
    }

    unshift(card) {
        card.x = this.x;
        card.y = this.y;
        this.cards.forEach(card => {
            card.y += this.offset; 
        });
        this.borders.height += this.getCardOffset();
        this.cards.unshift(card);
    }

    add(card) {
        if (this.isEmpty()) {
            card.x = this.borders.x;
            card.y = this.borders.y;
        }
        else {
            card.x = this.borders.x;
            const offset = this.getCardOffset();
            card.y = this.lastCard.y + offset;
            this.borders.height += offset;
        }
        this.cards.push(card);
    }

    pop() {
        const card = this.cards.pop();
        this.borders.height -= this.getCardOffset();
        return card;
    }

    drawPlaceholder(display) {
        if (this.showPlaceholder) {
            this.placeholder.draw(display);
        }
    }

    drawCards(display) {
        if (this.offset == 0) {
            this.lastCard?.draw(display);
            return;
        }

        const active = [];
        this.cards.forEach(card => {
            if (card.isDragging) {
                active.push(card);
            }
            else {
                card.draw(display);
            }
        });

        active.forEach(element => {
            element.draw(display);
        });
    }

    draw(display) {
        if (this.isEmpty() ) {
            this.drawPlaceholder(display);
            return;
        }
        display.drawShadow({borders: this.borders});
        this.drawCards(display);
    }

    isInside(point) {
        return this.borders.isInside(point.x, point.y);
    }

    isDeckInside(deck) {
        return this.borders.hasCollision(deck);
    }

    shuffle() {
        for (var i = this.cards.length - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    get lastCard() {
        return this.cards[this.cards.length - 1];
    }

    get firstCard() {
        return this.cards[0];
    }

    get x() {
        return this.borders.x;
    }

    set x(value) {
        const diff = value - this.borders.x;
        this.borders.x = value;
        this.cards.forEach(card => {
            card.x += diff;
        });
    }

    get y() {
        return this.borders.y;
    }

    set y(value) {
        const diff = value - this.borders.y;
        this.borders.y = value;
        this.cards.forEach(card => {
            card.y += diff;
        });
    }

    get height() {
        return this.borders.height;
    }

    set height(value) {
        this.borders.height = value;
    }

    get width() {
        return this.borders.width;
    }

    set width(value) {
        this.borders.width = value
    }

    get length() {
        return this.cards.length;
    }
}