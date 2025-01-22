export class SGOpenCardAction {
    constructor(card) {
        this.card = card;
    }

    revert() {
        this.card?.close();
    }
}