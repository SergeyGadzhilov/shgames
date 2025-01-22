import { SGFirework } from "./SGFirework";

export class SGFireworkRunner {
    constructor() {
        this.fireworks = [];
    }

    draw(display) {
        this.update(display);
        this.fireworks.forEach((firework, index) => {
            if (firework.isFinished()) {
                this.fireworks.slice(index, 1);
                return;
            }
            firework.draw(display);
        });
    }

    update(display) {
        if (Math.random() <= 0.015) {
            const x = Math.random() * display.width;
            this.fireworks.push(new SGFirework(x, 500));
        }
    }
}