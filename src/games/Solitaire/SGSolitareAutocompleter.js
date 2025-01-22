import { SGMoveCardAnimation } from "../../engine/animation/SGMoveCardAnimation";
import { CARDS_VALUES } from "../../engine/cards/card";
import { DECKS } from "./SGSolitare";

export class SGSolitareAutocompleter {
    constructor(settings) {
        this.decks = settings.decks;
        this.score = settings.score;
        this.animation = new SGMoveCardAnimation({stage: settings.stage});
    }

    isDeckFull(deck) {
        return deck.cards.length == 13;
    }

    isCompleted() {
        return (this.isDeckFull(this.decks[DECKS.FINISH_DECK1]) &&
        this.isDeckFull(this.decks[DECKS.FINISH_DECK2]) &&
        this.isDeckFull(this.decks[DECKS.FINISH_DECK3]) &&
        this.isDeckFull(this.decks[DECKS.FINISH_DECK4]));
    }

    findDestinationDeck(card) {
        for(let i = DECKS.FINISH_DECK1; i <= DECKS.FINISH_DECK4; ++i) {
            const deck = this.decks[i];
            if (this.isDeckFull(deck)) {
                continue;
            }

            if (deck.isEmpty() && card.value == CARDS_VALUES.ACE) {
                return deck;
            }

            if (deck.lastCard?.suit == card.suit) {
                if (deck.lastCard?.value == card.value - 1 ||
                    deck.lastCard?.value == CARDS_VALUES.ACE &&
                    card.value == CARDS_VALUES.TWO) {
                    return deck;
                }
            }
        }
        return null;
    }

    addScore() {
        this.score.addMove();
        this.score.addScoreValue(10);
    }

    async moveCardFromWorkDeck() {
        for (let i = DECKS.WORK_DECK1; i <= DECKS.WORK_DECK7; ++i) {
            if (await this.moveCardFromDeck(this.decks[i])) {
                this.addScore();
                return true;
            }
        }
        return false;
    }

    async moveCardFromDeck(source) {
        if (source.isEmpty()) {
            return false;
        }

        const destination = this.findDestinationDeck(source.lastCard);
        if (destination == null) {
            return false;
        }

        const card = source.pop();
        await this.animation.run(card, destination);
        destination.add(card);

        return true;
    }

    async moveCardFromOpenMainDeck() {
        if (await this.moveCardFromDeck(this.decks[DECKS.MAIN_DECK_OPEN])) {
            this.addScore();
            return true;
        }
        return false;
    }

    async moveCardsToMainDeck() {
        const deck = this.decks[DECKS.MAIN_DECK];
        const openDeck = this.decks[DECKS.MAIN_DECK_OPEN];
        while(!openDeck.isEmpty()) {
            let card = openDeck.pop();
            card.close();
            await this.animation.run(card, deck);
            deck.add(card);
        }
        this.score.addMove();
    }

    async moveCardToOpenDeck() {
        const main = this.decks[DECKS.MAIN_DECK];
        if (main.isEmpty()) {
            return;
        }
        const open = this.decks[DECKS.MAIN_DECK_OPEN];
        const card = main.pop();
        await this.animation.run(card, open);
        card.open();
        open.add(card);
        this.score.addMove();
    }

    async moveCardFromMainDeck() {
        while(!await this.moveCardFromOpenMainDeck()) {
            const mainDeck = this.decks[DECKS.MAIN_DECK];
            if (mainDeck.isEmpty()) {
                await this.moveCardsToMainDeck();
            }
            await this.moveCardToOpenDeck();
        }
    }

    async complete() {
        while(!this.isCompleted()) {
            if (await this.moveCardFromWorkDeck()) {
                continue;
            }
            await this.moveCardFromMainDeck();
        }
    }
}