export class SGMoves {
    constructor() {
        this.moves = 0;
        this.control = document.getElementById("moves");
        this.update();
    }

    get value() {
        return this.moves;
    }

    add() {
        this.moves += 1;
        this.update();
    }

    clear() {
        this.moves = 0;
        this.update();
    }

    update() {
        this.control.innerText = `Moves: ${this.moves}`;
    }
}