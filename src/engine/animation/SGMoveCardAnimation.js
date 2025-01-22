export class SGMoveCardAnimation {
    constructor(settings) {
        this.speed = settings?.speed ?? 1;
        this.stage = settings.stage;
    }

    getStep(source, destination) {
        if (source > destination) {
            const distance = (source - destination) / 10;
            return distance * -1;
        }
        else {
            return (destination - source) / 10;
        }
    }

    async run(card, destination) {
        this.stage.push(card);
        const stepX = this.getStep(card.x, destination.x);
        const stepY = this.getStep(card.y, destination.y);
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                let isFinished = true;
                if ((stepX > 0 && card.x < destination.x) ||
                    (stepX < 0 && card.x > destination.x)) {
                    card.x += stepX;
                    isFinished = false;
                }
    
                if ((stepY > 0 && card.y < destination.y) ||
                    (stepY < 0 && card.y > destination.y))
                {
                    card.y += stepY;
                    isFinished = false;
                }
    
                if (isFinished) {
                    clearInterval(interval);
                    this.stage.pop();
                    resolve();
                }

            }, this.speed);
        });
    }
}