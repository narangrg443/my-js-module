// src/controller.js

export class Button {
    constructor(x=100, y=100, radius=20, type = "button", text = "") {
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
        this.opacity = 1;
    }

    draw(context) {
        context.save();
        context.globalAlpha = this.opacity;

        if (this.type === 'button') {
            context.beginPath();
            context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            context.closePath();
            context.stroke();
        } else if (this.type === "analog") {
            context.beginPath();
            context.arc(this.X, this.Y, this.R, 0, Math.PI * 2);
            context.closePath();
         
            context.stroke();

            context.beginPath();
            context.fillStyle = "blue";
            context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            context.fill();
            context.closePath();
        } else {
            console.log('Incorrect type: Use "button" or "analog"');
            context.restore();
            return;
        }
        context.restore();
    }

    addButtonText(context) {
        if (this.type === 'button' && this.text.length === 1) {
            const textSize = this.r * 1.5;
            context.save();
            context.globalAlpha = this.opacity;
            context.font = `${textSize}px Arial`;
            context.fillText(this.text, this.x - textSize / 3, this.y + textSize / 3);
            context.restore();
        } else if (this.type === 'button' && this.text.length > 1) {
            console.log('Text must be a single letter');
        }
    }
}

export function touchEvent(buttons, canvas) {
    const rect = canvas.getBoundingClientRect();
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.touches.length; i++) {
            const touchX = Math.round(e.touches[i].clientX - rect.left);
            const touchY = Math.round(e.touches[i].clientY - rect.top);

            buttons.forEach(b => {
                const distanceSquared = Math.pow(b.x - touchX, 2) + Math.pow(b.y - touchY, 2);
                if (b.type === 'analog' && distanceSquared <= b.R * b.R) {
                    b.id = e.touches[i].identifier;
                    b.pressed = true;
                    b.opacity = 0.5;
                } else if (b.type === 'button' && distanceSquared <= b.r * b.r) {
                    b.id = e.touches[i].identifier;
                    b.pressed = true;
                    b.opacity = 0.5;
                }
            });
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const touchX = Math.round(touch.clientX - rect.left);
            const touchY = Math.round(touch.clientY - rect.top);

            buttons.forEach(b => {
                if (b.id === touch.identifier && b.type === 'analog') {
                    const dx = touchX - b.X;
                    const dy = touchY - b.Y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    b.direction.dx = dx / distance;
                    b.direction.dy = dy / distance;

                    if (distance < b.R) {
                        b.x = touchX;
                        b.y = touchY;
                    } else {
                        b.x = b.X + b.R * b.direction.dx;
                        b.y = b.Y + b.R * b.direction.dy;
                    }
                }
            });
        }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            buttons.forEach(b => {
                if (b.id === touch.identifier) {
                    b.pressed = false;
                    b.opacity = 1;
                    if (b.type === 'analog') {
                        b.direction = { dx: 0, dy: 0 };
                        b.x = b.X;
                        b.y = b.Y;
                    }
                    b.id = null;
                }
            });
        }
    });
}
