export class SGGameTimer {
    constructor() {
        this.startTime = 0;
        this.interval = null;
        this.distance = null;
        this.control = document.getElementById("timer");
        this.clear();
    }

    get value() {
        return `${this.format(this.distance.getUTCHours())}:${this.format(this.distance.getUTCMinutes())}:${this.format(this.distance.getUTCSeconds())}`;
    }

    format(value) {
        return value > 9 ? `${value}` : `0${value}`
    }

    start() {
        this.startTime = Date.now();
        this.interval = setInterval(() => {
            this.distance = new Date(Date.now() - this.startTime);
            this.control.innerText = this.value;
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
    }

    clear() {
        this.control.innerText = `00:00:00`;
    }
}