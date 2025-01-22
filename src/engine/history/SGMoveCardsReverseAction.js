export class SGMoveCardsReverseAction {
    constructor(options) {
        this.source = options.source;
        this.target = options.target;
        this.count = options.count;
    }

    revert() {
        for(let i = 0; i < this.count; ++i) {
            this.source.add(this.target.pop());
        }
    }
}