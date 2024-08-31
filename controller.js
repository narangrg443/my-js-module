class Button {
    constructor(x = 100, y = 100, radius = 20, canvas, type = "button", text = "") {
        this.x = x;
        this.y = y;
        this.r = radius;
        this.R = this.r * 2;
        this.type = type;
        this.X = this.x;
        this.Y = this.y;
        this.text = text;
        this.pressed = false;
        this.id = null;
        this.direction = { dx: 0, dy: 0 };
        this.opacity = 0.8;
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
    }

    draw() {
        if (!this.context) {
            console.error("Context is undefined or null.");
            return;
        }

        this.context.save();
        this.context.globalAlpha = this.opacity;

        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2);

        if (this.type === 'button') {
            this.context.font = `${this.r}px Arial`;
            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';
            this.context.fillText(this.text.charAt(0), this.x, this.y);
            this.context.closePath();
            this.context.stroke();
        } else if (this.type === "analog") {
            this.context.arc(this.X, this.Y, this.R, 0, Math.PI * 2);
            this.context.closePath();
            this.context.stroke();

            this.context.beginPath();
            this.context.fillStyle = "yellow";
            this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            this.context.fill();
            this.context.closePath();
        } else {
            console.error('Incorrect type: Use "button" or "analog"');
        }

        this.context.restore();
    }
}

export const controller = {
    canvas: null,
    buttons: [],

    draw() {
        if (!this.canvas) {
            console.error("Canvas is not defined.");
            return;
        }

        const context = this.canvas.getContext('2d');
        if (!context) {
            console.error("Failed to get 2D context from canvas.");
            return;
        }

        context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear previous frame
        this.buttons.forEach(button => button.draw());
    },

    add(x, y, r, canvas, type, text) {
        const button = new Button(x, y, r, canvas, type, text);
        this.buttons.push(button);
        return button;
    },

    update(canvas) {
        this.canvas = canvas;
        const rect = canvas.getBoundingClientRect();

        canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e, rect), { passive: false });
        canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e, rect), { passive: false });
        canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    },

    handleTouchStart(e, rect) {
        e.preventDefault();
        for (let i = 0; i < e.touches.length; i++) {
            const { clientX, clientY } = e.touches[i];
            const touchX = Math.round(clientX - rect.left);
            const touchY = Math.round(clientY - rect.top);

            this.buttons.forEach(button => {
                const distanceSquared = (button.x - touchX) ** 2 + (button.y - touchY) ** 2;
                if ((button.type === 'analog' && distanceSquared <= button.R ** 2) ||
                    (button.type === 'button' && distanceSquared <= button.r ** 2)) {
                    button.id = e.touches[i].identifier;
                    button.pressed = true;
                    button.opacity = 0.5;
                }
            });
        }
    },

    handleTouchMove(e, rect) {
        for (let i = 0; i < e.touches.length; i++) {
            const { clientX, clientY, identifier } = e.touches[i];
            const touchX = clientX - rect.left;
            const touchY = clientY - rect.top;

            this.buttons.forEach(button => {
                if (button.id === identifier && button.type === 'analog') {
                    const dx = touchX - button.X;
                    const dy = touchY - button.Y;
                    const distanceSquared = dx * dx + dy * dy;
                    const maxDistanceSquared = button.R ** 2;

                    if (distanceSquared < maxDistanceSquared) {
                        button.x = touchX;
                        button.y = touchY;
                    } else {
                        const distance = Math.sqrt(distanceSquared);
                        button.direction.dx = dx / distance;
                        button.direction.dy = dy / distance;
                        button.x = button.X + button.R * button.direction.dx;
                        button.y = button.Y + button.R * button.direction.dy;
                    }
                }
            });
        }
    },

    handleTouchEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const { identifier } = e.changedTouches[i];

            this.buttons.forEach(button => {
                if (button.id === identifier) {
                    button.pressed = false;
                    button.opacity = 1;
                    if (button.type === 'analog') {
                        button.direction = { dx: 0, dy: 0 };
                        button.x = button.X;
                        button.y = button.Y;
                    }
                    button.id = null;
                }
            });
        }
    }
};
