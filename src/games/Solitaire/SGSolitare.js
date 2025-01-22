import { SGMoveCardAnimation } from "../../engine/animation/SGMoveCardAnimation";
import { Assets } from "../../engine/assets";
import { CARDS_VALUES } from "../../engine/cards/card";
import { SGCardsFactory } from "../../engine/cards/SGCardsFactory";
import { CARD_SUITS } from "../../engine/cards/SGCardSuit";
import { Deck } from "../../engine/deck";
import { Display } from "../../engine/display";
import { SGFireworkRunner } from "../../engine/fireworks/SGFireworkRunner";
import { SGHistory } from "../../engine/history/SGHistory";
import { SGDraggable } from "../../engine/SGDraggable";
import { SGStage } from "../../engine/SGStage";
import { SGSolitareAutocompleter } from "./SGSolitareAutocompleter";
import { SGSolitareScore } from "./SGSolitateScore";

export const DECKS = {
    MAIN_DECK: 0,
    MAIN_DECK_OPEN: 1,
    FINISH_DECK1: 2,
    FINISH_DECK2: 3,
    FINISH_DECK3: 4,
    FINISH_DECK4: 5,
    WORK_DECK1: 6,
    WORK_DECK2: 7,
    WORK_DECK3: 8,
    WORK_DECK4: 9,
    WORK_DECK5: 10,
    WORK_DECK6: 11,
    WORK_DECK7: 12
};

export class SGSolitare extends EventTarget {
    constructor() {
        super();
        this.display = new Display("canvas");
        this.firework = new SGFireworkRunner();
        this.stage = new SGStage(this.display);
        this.assets = new Assets();
        this.isStarted = false;
        this.score = new SGSolitareScore(this.decks);
        this.history = new SGHistory();
        this.selected = null;
        this.moveAnimator = new SGMoveCardAnimation({
            stage: this.stage
        });
        this.hasUpdate = true;
        this.initDecks();
        this.initEventListseners();
    }

    initDecks() {
        this.decks = [];
        this.decks.push(new Deck({
            id: DECKS.MAIN_DECK,
            position: {x: 680, y: 20},
            offset: 0
        }));
        this.decks.push(new Deck({
            id: DECKS.MAIN_DECK_OPEN,
            position: {x: 550, y: 20},
            offset: 0,
            showPlaceholder: false
        }));
        this.generateDecks(20, 20, 4, 0, DECKS.FINISH_DECK1);
        this.generateDecks(20, 200, 7, 32, DECKS.WORK_DECK1);
    }

    generateDecks(x, y, count, offset, startId) {
        for(let i = 0; i < count; ++i) {
            this.decks.push(new Deck({
                id: startId + i,
                position: {x: x, y: y},
                offset: offset
            }));
            x += 110;
        }
    }

    initEventListseners() {
        this.decks.forEach(deck => {
            deck.addEventListener("ondeckselect", (event) => this.onDeckSelect(event));
        });
    }

    isMainDeck(deck) {
        return DECKS.MAIN_DECK === deck.id;
    }

    clearSelection() {
        if (this.selected) {
            this.selected.unselect();
            this.selected = null;
        }
    }

    onMainDeckClick() {
        this.clearSelection();
        this.score.addScoreValue(0);
        this.score.addMove();
        const deck = this.decks[DECKS.MAIN_DECK];
        const openDeck = this.decks[DECKS.MAIN_DECK_OPEN];
        if (deck.isEmpty()) {
            this.history.moveDeckCardsReverse({
                source: openDeck,
                target: deck,
                count: openDeck.length,
                continue: false
            });
            while(!openDeck.isEmpty()) {
                const card = openDeck.pop();
                card.close();
                this.history.closeCard({
                    card: card,
                    continue: true
                });
                deck.add(card);
            }
            return;
        }

        const card = deck.pop();
        this.history.moveDeckCards({source: deck, target: openDeck, count: 1, continue: false});
        card.open();
        this.history.openCard({
            card: card,
            continue: true
        });
        openDeck.add(card);
    }

    moveSelection(target) {
        if (target == null || this.selected == null) {
            return false;
        }

        if (this.selected === target) {
            this.selected.unselect();
            return false;
        }

        const selected = this.selected.popSelectedDeck();
        if (selected.isEmpty()) {
            return false;
        }

        selected.unselect();

        if (!this.isValidTarget(selected, target)) {
            this.selected.addDeck(selected);
            this.selected = null;
            return false;
        }

        target.addDeck(selected);
        this.history.moveDeckCards({
            source: this.selected,
            target: target,
            count: selected.length,
            continue: false
        });

        this.score.addMove();
        this.score.addScore(this.selected, target);

        if (this.selected.lastCard?.isClosed()) {
            this.selected.lastCard?.open();
            this.history.openCard({
                card: this.selected.lastCard,
                continue: true
            });
        }

        if (this.isFinishDeck(target)) {
            this.checkGameFinish();
        }
        this.checkAutocomplete(this.selected);

        this.selected = null;
        return true;
    }

    async onDeckSelect(event) {
        const cursor = event.detail.cursor;
        const deck = event.detail.deck;
        if (this.isMainDeck(deck)) {
            this.onMainDeckClick();
            return;
        }

        if (this.moveSelection(deck)) {
            return;
        }

        if (deck.isEmpty()) {
            return;
        }

        const card = deck.getCardByPosition(cursor);
        if (!card || card.isClosed()) {
            return;
        }

        const selection = deck.popDeck(cursor.x, cursor.y);
        selection.select();

        const draggable = new SGDraggable(selection, cursor, deck);
        draggable.addEventListener("stopdragging", (event) => this.onDragStop(event));
        this.stage.push(draggable);
    }

    isValidTarget(source, target) {
        if (source == null || target == null) {
            return false;
        }

        if (target.id == DECKS.MAIN_DECK) {
            return false;
        }

        if (this.isWorkDeck(target)) {
            if (target.isEmpty()) {
                return source.firstCard?.value == CARDS_VALUES.KING;
            }

            if (target.lastCard?.isBlack() == source.firstCard?.isBlack()) {
                return false;
            }

            if (target.lastCard?.value == CARDS_VALUES.TWO &&
                source.firstCard?.value == CARDS_VALUES.ACE) {
                return true;
            }

            return (target.lastCard?.value == source.firstCard?.value + 1);
        }

        if (this.isFinishDeck(target)) {
            if (source.length > 1) {
                return false;
            }

            if (target.isEmpty()) {
                return source.firstCard?.value == CARDS_VALUES.ACE;
            }

            if (target.lastCard?.suit != source.firstCard?.suit) {
                return false;
            }

            if (target.lastCard?.value == CARDS_VALUES.ACE) {
                return source.firstCard?.value == CARDS_VALUES.TWO;
            }
            return target.lastCard?.value == source.firstCard?.value - 1;
        }
        return false;
    }

    getTargetDeck(event) {
        return this.decks.find(deck=> {
            if (this.isMainDeck(deck)) {
                return false;
            }

            if (!deck.isDeckInside(event.obj)) {
                return false;
            }

            return this.isValidTarget(event.obj, deck);
        }) ?? event.source;
    }

    async onDragStop(event) {
        event.detail.removeEventListener("stopdragging", this.onDragStop);
        const deck = event.detail.obj;
        const source = event.detail.source;
        const target = this.getTargetDeck(event.detail);
        if (target !== source) {
            this.score.addMove();
            deck.unselect();
            this.score.addScore(source, target);
            this.history.moveDeckCards({
                source: source,
                target: target,
                count: deck.cards.length,
                continue: false
            });
        }

        target.addDeck(deck);
        this.selected = target;
        if (source.lastCard?.isClosed()) {
            source.lastCard?.open();
            this.history.openCard({
                card: event.detail.source.lastCard,
                continue: true
            });
        }
        this.stage.pop();
        if (this.isFinishDeck(target)) {
            this.checkGameFinish();
        }
        this.checkAutocomplete(source);
    }

    isFinishDeck(deck) {
        return deck.id >= DECKS.FINISH_DECK1 && deck.id <= DECKS.FINISH_DECK4;
    }

    isWorkDeck(deck) {
        return deck.id >= DECKS.WORK_DECK1 && deck.id <= DECKS.WORK_DECK7;
    }

    checkAutocomplete(source) {
        if (!this.isWorkDeck(source)) {
            return;
        }

        for (let i = DECKS.WORK_DECK1; i <= DECKS.WORK_DECK7; ++i) {
            if (this.decks[i].hasClosedCards()) {
                return;
            }
        }
        this.dispatchEvent(new CustomEvent("show_autocomplete"));
    }

    async autoComplete() {
        const autocompleter = new SGSolitareAutocompleter({
            score: this.score,
            decks: this.decks,
            stage: this.stage
        });
        await autocompleter.complete();
        this.checkGameFinish();
    }

    async loadAssets() {
        const cards = ["assets/cards/cardback.png"];
        for(let i = 11; i <= 13; ++i) {
            cards.push(`assets/cards/clubs/${i}.png`);
            cards.push(`assets/cards/diamonds/${i}.png`);
            cards.push(`assets/cards/hearts/${i}.png`);
            cards.push(`assets/cards/spades/${i}.png`);
        }
        cards.push(`assets/cards/clubs/clubs.png`);
        cards.push(`assets/cards/diamonds/diamonds.png`);
        cards.push(`assets/cards/hearts/hearts.png`);
        cards.push(`assets/cards/spades/spades.png`);
        await this.assets.loadImages(cards);
    }

    addCardsToMainDeck() {
        var factory = new SGCardsFactory();

        for(let i = 1; i <= 13; ++i) {
            this.decks[DECKS.MAIN_DECK].add(factory.create({
                suit: CARD_SUITS.CLUBS,
                value: i,
                assets: this.assets
            }));

            this.decks[DECKS.MAIN_DECK].add(factory.create({
                suit: CARD_SUITS.DIAMONDS,
                value: i,
                assets: this.assets
            }));

            this.decks[DECKS.MAIN_DECK].add(factory.create({
                suit: CARD_SUITS.HEARTS,
                value: i,
                assets: this.assets
            }));

            this.decks[DECKS.MAIN_DECK].add(factory.create({
                suit: CARD_SUITS.SPADES,
                value: i,
                assets: this.assets
            }));
        }
        this.decks[DECKS.MAIN_DECK].shuffle();
    }

    async moveCard(card, destination) {
        const animation = new SGMoveCardAnimation({
            card: card,
            stage: this.stage,
            destination: destination.isEmpty() ? destination : destination.lastCard,
            speed: 10
        });
        await animation.run();
    }

    async addCardsToWorkDecks() {
        let count = 1;
        for(let i = DECKS.WORK_DECK1; i <= DECKS.WORK_DECK7; ++i) {
            for(let j = 0; j < count; ++j) {
                const card = this.decks[DECKS.MAIN_DECK].pop();
                await this.moveAnimator.run(card, this.decks[i]);
                this.decks[i].add(card);
            }
            this.decks[i].lastCard.open();
            ++count;
        }
    }

    addDecksToStage() {
        this.decks.forEach(deck => {
            this.stage.push(deck);
        });
    }

    isGameFinished() {
        return (this.isDeckFull(this.decks[DECKS.FINISH_DECK1]) && 
        this.isDeckFull(this.decks[DECKS.FINISH_DECK2]) && 
        this.isDeckFull(this.decks[DECKS.FINISH_DECK3]) &&
        this.isDeckFull(this.decks[DECKS.FINISH_DECK4]));
    }

    checkGameFinish() {
        if (this.isGameFinished())
        {
            this.history.clear();
            this.dispatchEvent(new CustomEvent("gamefinished"));
        }
    }

    isDeckFull(deck) {
        return deck.cards.length == 13;
    }

    async load() {
        await this.loadAssets();
        this.addCardsToMainDeck();
        this.addDecksToStage();
        this.addCardsToWorkDecks();
    }

    clear() {
        this.initDecks();
        this.initEventListseners();
        this.history.clear();
        this.stage.clear();
    }

    async start() {
        this.clear();
        await this.load();
        this.isStarted = true;
        this.update();
    }

    async stop() {
        this.isStarted = false;
    }

    async update() {
        if (this.isStarted) {
            this.display.clear();
            this.stage.update();
            window.requestAnimationFrame(() => this.update());
        }
    }

    showFirework() {
        this.stage.push(this.firework);
    }

    revert() {
        this.history.revert();
    }
}