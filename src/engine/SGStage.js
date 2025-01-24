
export class SGStage {
    constructor(display) {
        this.gameObjects = [];
        this.display = display;
        this.isDragging = false;
        this.initEventListeners();
    }

    initEventListeners() {
        this.display.addEventListener("mousedown", (event) => this.onMouseDown(event));
        this.display.addEventListener("touchstart", (event) => this.onTouchStart(event));
        this.display.addEventListener("mousemove", (event) => this.onMouseMove(event));
        this.display.addEventListener("touchmove", (event) => this.onTouchMove(event));
        this.display.addEventListener("mouseup", (event) => this.onMouseUp(event));
        this.display.addEventListener("touchend", (event) => this.onMouseUp(event));
    }

    async onTouchMove(event) {
        event.preventDefault();
        for(let i = 0; i < event.touches.length; ++i) {
            const touch = event.touches.item(i);
            const evt = this.display.translatePossition({clientX: touch.pageX, clientY: touch.pageY});
            for(let i = this.gameObjects.length - 1; i >= 0; --i) {
                if (this.gameObjects[i] && this.gameObjects[i].onMouseMove) {
                    if (await this.gameObjects[i].onMouseMove(evt)) {
                        return;
                    }
                }
            }
        }
    }

    async onTouchStart(event) {
        event.preventDefault();
        if (this.isDragging) {
            return;
        }
        this.isDragging = true;
        for(let i = 0; i < event.touches.length; ++i) {
            const touch = event.touches.item(i);
            const evt = this.display.translatePossition({clientX: touch.pageX, clientY: touch.pageY});
            for(let i = this.gameObjects.length - 1; i >= 0; --i) {
                if (this.gameObjects[i] && this.gameObjects[i].onMouseDown) {
                    if (await this.gameObjects[i].onMouseDown(evt)) {
                        return;
                    }
                }
            }
        }
    }

    async onMouseDown(event) {
        event.preventDefault();
        const evt = this.display.translatePossition(event);
        for(let i = this.gameObjects.length - 1; i >= 0; --i) {
            if (this.gameObjects[i] && this.gameObjects[i].onMouseDown) {
                if (await this.gameObjects[i].onMouseDown(evt)) {
                    return;
                }
            }
        }
    }

    async onMouseMove(event) {
        event.preventDefault();
        const evt = this.display.translatePossition(event);
        for(let i = this.gameObjects.length - 1; i >= 0; --i) {
            if (this.gameObjects[i] && this.gameObjects[i].onMouseMove) {
                if (await this.gameObjects[i].onMouseMove(evt)) {
                    return;
                }
            }
        }
    }

    async onMouseUp(event) {
        event.preventDefault();
        this.isDragging = false;
        for(let i = this.gameObjects.length - 1; i >= 0; --i) {
            if (this.gameObjects[i] && this.gameObjects[i].onMouseUp) {
                if (await this.gameObjects[i].onMouseUp()) {
                    return;
                }
            }
        }
    }

    push(obj) {
        this.gameObjects.push(obj);
    }

    pop() {
        return this.gameObjects.pop();
    }

    update() {
        this.display.clear();
        this.gameObjects.forEach(obj => {
            obj.draw(this.display);
        });
    }

    clear() {
        this.gameObjects = [];
    }
}