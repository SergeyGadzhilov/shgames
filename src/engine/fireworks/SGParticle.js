export class SGParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.friction = 0.99;
        this.lifespan = 10;
    }

    draw(display) {
        this.update();
        display.drawCircle({
            x: this.x,
            y: this.y,
            color: this.color
        });
    }

    isFinished() {
        return this.lifespan <= 0;
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.lifespan -= 1;
    }
}