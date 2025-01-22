export class SGFinishDialog {
    constructor() {
        this.dialog = document.getElementById("finish_dialog");
        this.score = document.getElementById("finish_score");
        this.moves = document.getElementById("finish_moves");
        this.time = document.getElementById("finish_time");
    }

    show(values) {
        this.dialog.style.display = "flex";
        this.score.innerText = `${values.score}`;
        this.moves.innerHTML = `${values.moves}`;
        this.time.innerHTML = `${values.time}`;
    }

    close() {
        this.dialog.style.display = "none";
    }
}