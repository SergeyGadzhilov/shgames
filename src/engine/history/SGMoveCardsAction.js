export class SGMoveCardsAction {
    constructor(options) {
        this.source = options.source;
        this.target = options.target;
        this.count = options.count;
    }

    revert() {
        const cards = [];
        for(let i = 0; i < this.count; ++i) {
            cards.push(this.target.pop());
        }

        for(let i = cards.length - 1; i >= 0; --i) {
            if (cards[i]) {
                this.source.add(cards[i]);
            }
        }
    }
}