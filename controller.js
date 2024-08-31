// src/controller.js

class Button {
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
        this.opacity = .8;
    }

    draw(context) {
        context.save();
        context.globalAlpha = this.opacity;

        if (this.type === 'button') {
            context.beginPath();
            context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            
            context.font = `${this.r}px Arial`; // Set the font size relative to the radius
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            const text = this.text.charAt(0); // Take only the first letter
            context.fillText(text, this.x, this.y);

            context.closePath();
            context.stroke();
        } else if (this.type === "analog") {
            context.beginPath();
            context.arc(this.X, this.Y, this.R, 0, Math.PI * 2);
            context.closePath();
         
            context.stroke();

            context.beginPath();
            context.fillStyle = "yellow";
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


}



export const controller={

buttons:[],
draw:function(context){
if(this.buttons){
    this.buttons.forEach(b=>{
      b.draw(context);
    })
}
},
add:function(x,y,r,type,text){
    const button=new Button(x,y,r,type,text);
    this.buttons.push(button)
    return button;
},
update:function(canvas){
    const rect = canvas.getBoundingClientRect();
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.touches.length; i++) {
            const touchX = Math.round(e.touches[i].clientX - rect.left);
            const touchY = Math.round(e.touches[i].clientY - rect.top);

            this.buttons.forEach(b => {
                const distanceSquared = (b.x - touchX)*(b.x - touchX)+(b.y - touchY)*(b.y - touchY);
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
        const rect = canvas.getBoundingClientRect();
    
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;
    
            this.buttons.forEach(b => {
                if (b.id === touch.identifier && b.type === 'analog') {
                    const dx = touchX - b.X;
                    const dy = touchY - b.Y;
                    const distanceSquared = dx * dx + dy * dy;
                    const maxDistanceSquared = b.R * b.R;
    
                    // Normalize direction vector
                    const distance = Math.sqrt(distanceSquared);
                    b.direction.dx = dx / distance;
                    b.direction.dy = dy / distance;
    
                    // Check if the touch is within the boundary
                    if (distanceSquared < maxDistanceSquared) {
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
            this.buttons.forEach(b => {
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

}
