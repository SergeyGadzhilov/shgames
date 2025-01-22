import { DECKS } from "./SGSolitare";

export class SGSolitareScore extends EventTarget {
    constructor() {
        super();
    }

    isWorkDeck(deck) {
        return deck.id >= DECKS.WORK_DECK1 && deck.id <= DECKS.WORK_DECK7;
    }

    isOpenMainDeck(deck) {
        return DECKS.MAIN_DECK_OPEN === deck.id;
    }

    isFinishDeck(deck) {
        return deck.id >= DECKS.FINISH_DECK1 && deck.id <= DECKS.FINISH_DECK4;
    }

    addScoreValue(value) {
        this.dispatchEvent(new CustomEvent("addScore", {detail: value}));
    }

    addScore(source, target) {
        if (source == null || target == null || source === target) {
            return;
        }

        if (this.isFinishDeck(source)) {
            this.dispatchEvent(new CustomEvent("addScore", {detail: -10}));
            return;
        }

        let score = 0;
        if (this.isFinishDeck(target)) {
            score += 10;
        }

        if (this.isWorkDeck(source) && source.lastCard?.isClosed()) {
            score += 5;
        }

        if (this.isOpenMainDeck(source) && this.isWorkDeck(target)) {
            score = 5;
        }
        this.dispatchEvent(new CustomEvent("addScore", {detail: score}));
    }

    addMove() {
        this.dispatchEvent(new CustomEvent("addMove"));
    }
}