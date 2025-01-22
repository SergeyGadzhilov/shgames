export class SGScore {
    constructor() {
        this.score = 0;
        this.history = [];
        this.control = document.getElementById("score");
        this.update();
    }

    get value() {
        return this.score;
    }

    add(value) {
        this.history.push(value);
        this.score += value;
        this.update();
    }

    revert() {
        if (this.history.length > 0) {
            this.score -= this.history.pop();
            this.update();
        }
    }

    clear() {
        this.score = 0;
        this.history = [];
        this.update();
    }

    update() {
        this.control.innerText = `Score: ${this.score}`;
    }
}