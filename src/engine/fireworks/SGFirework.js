import { SGParticle } from "./SGParticle";

export class SGFirework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = `hsl(${Math.random() * 360}, 90%, 90%)`;
        this.velocity = {x: 0, y: Math.random() * -2.5 - 0.5};
        this.particles = [];
        this.lifespan = 180;
        this.hasExploded = false;
    }

    draw(display) {
        this.update();
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(display);
        }

        display.drawCircle({
            x: this.x,
            y: this.y,
            color: this.color
        });
    }

    explode() {
        for (let i = 0; i < 50; i++) {
            this.particles.push(new SGParticle(this.x, this.y, this.color));
        }
    }

    isFinished() {
        this.particles.forEach(particle => {
            if (!particle.isFinished()) {
                return false;
            }
        });
        return false;
    }

    update() {
        this.lifespan--;

        if (this.lifespan <= 0 && !this.hasExploded) {
            this.explode();
            this.velocity = {x: 0, y: 0};
            this.hasExploded = true;
        } else if (this.lifespan > 0) {
            this.y += this.velocity.y;
        }

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
        }
    }
}