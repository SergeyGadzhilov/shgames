import { SGCloseCardAction } from "./SGCloseCardAction";
import { SGMoveCardsAction } from "./SGMoveCardsAction";
import { SGMoveCardsReverseAction } from "./SGMoveCardsReverseAction";
import { SGOpenCardAction } from "./SGOpenCardAction";

export class SGHistory extends EventTarget {
    constructor() {
        super();
        this.history = [];
    }

    moveDeckCards(item) {
        this.addItem({action: new SGMoveCardsAction(item), continue: item.continue});
    }

    moveDeckCardsReverse(item) {
        this.addItem({action: new SGMoveCardsReverseAction(item), continue: item.continue});
    }

    addItem(item) {
        this.history.push(item);
        if (this.history.length == 1) {
            this.dispatchEvent(new CustomEvent("add_history"));
        }
    }

    openCard(item) {
        this.addItem({
            action: new SGOpenCardAction(item.card),
            continue: item.continue
        });
    }

    closeCard(item) {
        this.addItem({
            action: new SGCloseCardAction(item.card),
            continue: item.continue
        });
    }

    clear() {
        this.history = [];
        this.dispatchEvent(new CustomEvent("empty_history"));
    }

    revert() {
        let item = this.history.pop();
        if (item) {
            item.action.revert();
            while(item?.continue) {
                item = this.history.pop();
                item.action.revert();
            }
        }

        if (this.history.length == 0) {
            this.dispatchEvent(new CustomEvent("empty_history"));
        }
    }
}