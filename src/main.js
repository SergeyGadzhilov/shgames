import { SGSolitare } from "./games/Solitaire/SGSolitare";
import { SGFinishDialog } from "./games/Solitaire/ui/FinishDialog";
import { SGScorePanel } from "./games/Solitaire/ui/ScorePanel/SGScorePanel";
import { SGControlPannel } from "./games/Solitaire/ui/SGControlPannel";

const game = new SGSolitare();
const finishDialog = new SGFinishDialog();
const scorePanel = new SGScorePanel();
const controls = new SGControlPannel(game);
controls.hideAutocomplete();

controls.addEventListener("onNewGame", () => {
    scorePanel.startGame();
    finishDialog.close();
    controls.hideAutocomplete();
    game.stop();
    game.start();
});

controls.addEventListener("onExitGame", () => {
    navigator?.app?.exitApp();
});

controls.addEventListener("onRevert", () => {
    game.revert();
    scorePanel.revertScore();
    controls.hideAutocomplete();
});

controls.addEventListener("onAutocomplete", () => {
    game.autoComplete();
});

game.addEventListener("gamefinished", () => {
    game.showFirework();
    scorePanel.stopGame();
    finishDialog.show(scorePanel.getScoreData());
    controls.hideAutocomplete();
    controls.hideUndo();
});

game.history.addEventListener("add_history", () => {
    controls.showUndo();
});

game.history.addEventListener("empty_history", () => {
    controls.hideUndo();
});

game.addEventListener("show_autocomplete", () => {
    controls.hideUndo();
    controls.showAutocomplete();
});

game.score.addEventListener("addMove", () => {
    scorePanel.addMove();
});

game.score.addEventListener("addScore", (event) => {
    scorePanel.addScore(event.detail);
});

scorePanel.startGame();
game.start();
