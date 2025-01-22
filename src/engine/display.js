export class Display {
    constructor(id) {
        this.canvas = document.getElementById(id);
        if (this.canvas == null) {
            throw new Error("Display: canvas not found");
        }
        this.canvas.width = 800;
        this.canvas.height = 1200;
        this.context = this.canvas.getContext("2d");
        if (this.context == null) {
            throw new Error("Display: fail to get context");
        }
        this.context.font = "bold 26pt Roboto";
        this.canvas.imageSmoothingEnabled = false;
    }

    translatePossition(position) {
        var rect = this.canvas.getBoundingClientRect();
        if (rect.width < this.canvas.width) {
            const x = this.canvas.width / rect.width;
            const y = this.canvas.height / rect.height;
            return {
                x: (position.clientX - this.canvas.offsetLeft) * x,
                y: (position.clientY - this.canvas.offsetTop) * y
            }
        }

        return {
          x: position.clientX - rect.x,
          y: position.clientY - rect.y
        };
    }

    addEventListener(event, handler) {
        this.canvas.addEventListener(event, handler);
    }

    drawShadow(settings) {
        this.context.shadowColor = settings?.color ?? "black";
        this.context.shadowBlur = settings?.blure ?? 5;
        this.context.shadowOffsetX = settings?.offsetX ?? 2;
        this.context.shadowOffsetY = settings?.offsetY ?? 2;
        this.roundRect({
            color: settings?.color ?? '#fffff',
            background: settings?.color ?? '#000',
            rectangle: settings?.borders ?? {x: 0, y: 0, width: 100, height : 100},
            radius: settings?.radius ?? 5
        });
        this.context.shadowColor = 'rgba(0,0,0,0)';
    }

    drawText(settings) {
        if (settings.font) {
            this.context.font = settings.font;
        }
        this.context.fillStyle = settings.color;
        this.context.fillText(settings.text, settings.x, settings.y);
    }

    drawImage(image, rect) {
        this.context.beginPath();
        this.context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
    }

    drawCircle(circle) {
        this.context.beginPath();
        this.context.arc(circle.x, circle.y, 3, 0, Math.PI * 2, false);
        this.context.fillStyle = circle.color;
        this.context.fill();
    }

    stroke(figure) {
        this.context.beginPath();
        this.context.lineWidth = figure.lineWidth;
        this.context.strokeStyle = figure.color;
        this.context.rect(figure.position.x, figure.position.y, figure.size.width, figure.size.height);
        this.context.stroke();
    }

    roundRect(options) {
        this.context.beginPath();
        this.context.strokeStyle = options.color;
        this.context.lineWidth = options.lineWidth ?? 1;
        this.context.fillStyle =  options.background;
        this.context.roundRect(
            options.rectangle.x,
            options.rectangle.y,
            options.rectangle.width,
            options.rectangle.height,
            options.radius
        );
        this.context.stroke();
        this.context.fill();
    }

    set filter(value) {
        this.context.filter = value;
    }

    get filter() {
        return this.context.filter;
    }

    fillRect(settings) {
        this.context.beginPath();
        this.context.fillStyle = settings.color;
        this.context.fillRect(
            settings.borders.x,
            settings.borders.y,
            settings.borders.width,
            settings.borders.height
        );
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }
}