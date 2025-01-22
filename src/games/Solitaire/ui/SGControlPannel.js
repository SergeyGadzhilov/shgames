export class SGControlPannel extends EventTarget {
    constructor() {
        super();
        this.newGameButton = document.getElementById("new_game");
        this.closeButton = document.getElementById("exit");
        this.revertButton = document.getElementById("revert");
        this.autocompleteButton = document.getElementById("autocomplete");
        this.initListeners();
    }

    initListeners() {
        this.newGameButton.addEventListener("click", () => this.dispatchEvent(new CustomEvent("onNewGame")));
        this.closeButton.addEventListener("click", () => this.dispatchEvent(new CustomEvent("onExitGame")));
        this.revertButton.addEventListener("click", () => this.dispatchEvent(new CustomEvent("onRevert")));
        this.autocompleteButton.addEventListener("click", () => this.dispatchEvent(new CustomEvent("onAutocomplete")));
    }

    hideAutocomplete() {
        this.hideButton(this.autocompleteButton);
    }

    showAutocomplete() {
        this.showButton(this.autocompleteButton);
    }

    hideUndo() {
        this.hideButton(this.revertButton);
    }

    showUndo() {
        this.showButton(this.revertButton);
    }

    showButton(button) {
        button.style.display = "flex";
    }

    hideButton(button) {
        button.style.display = "none";
    }
}