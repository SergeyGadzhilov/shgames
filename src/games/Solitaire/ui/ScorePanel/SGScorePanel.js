import { SGGameTimer } from "./SGGameTimer";
import { SGMoves } from "./SGMoves";
import { SGScore } from "./SGScore";

export class SGScorePanel {
    constructor() {
        this.score = new SGScore();
        this.time = new SGGameTimer();
        this.moves = new SGMoves();
        this.clear();
    }

    getScoreData() {
        return {
            score: this.score.value,
            moves: this.moves.value,
            time: this.time.value
        }
    }

    addMove() {
        this.moves.add();
    }

    addScore(value) {
        this.score.add(value);
    }

    revertScore() {
        this.score.revert();
    }

    startGame() {
        this.clear();
        this.time.start();
    }

    stopGame() {
        this.time.stop();
    }

    clear() {
        this.time.clear();
        this.score.clear();
        this.moves.clear();
    }
}