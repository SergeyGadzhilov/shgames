export class SGCloseCardAction {
    constructor(card) {
        this.card = card;
    }

    revert() {
        this.card?.open();
    }
}