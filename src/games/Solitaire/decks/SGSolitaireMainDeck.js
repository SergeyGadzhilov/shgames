import { Deck } from "../../../engine/deck";
import { DECKS } from "../SGSolitare";

export class SGSolitaireMainDeck extends Deck {
    constructor() {
        super({
            id: DECKS.MAIN_DECK,
            position: {x: 680, y: 20},
            offset: 0
        })
    }
}