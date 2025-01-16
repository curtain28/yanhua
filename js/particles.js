class Particle {
    constructor(x, y, color, angle, speed, life) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.speed = speed;
        this.life = life;
        this.opacity = 0;
        this.history = [];
        this.fadeSpeed = 0.02;
        this.initialSpeed = speed;
        this.stayTime = 1;
        this.createTime = Date.now();
        this.initialX = x;
        this.initialY = y;
        this.targetX = x;
        this.targetY = y;
        this.appearProgress = 0;
        this.fadeOutSpeed = 0.5 + Math.random() * 0.5;
        this.fadeOutAngle = Math.random() * Math.PI * 2;
        
        const isLandscape = window.innerWidth > window.innerHeight;
        if(isMobileDevice()) {
            if(isLandscape) {
                this.trailLength = 3;
                this.size = 1;
            } else {
                this.trailLength = 5;
                this.size = 1.5;
            }
        } else {
            this.trailLength = 10;
            this.size = 2;
        }
    }

    update() {
        if (this.isTextParticle) {
            const existTime = (Date.now() - this.createTime) / 1000;
            
            if (existTime < 1.5) {
                this.opacity = Math.min(1, existTime * 1.2);
                this.appearProgress = easeOutElastic(Math.min(1, existTime / 1.5));
                this.x = this.initialX + (this.targetX - this.initialX) * this.appearProgress;
                this.y = this.initialY + (this.targetY - this.initialY) * this.appearProgress;
            } else if (existTime < this.stayTime + 1.5) {
                this.opacity = 1;
                const floatTime = existTime * 2;
                this.x = this.targetX + Math.sin(floatTime) * 0.5;
                this.y = this.targetY + Math.cos(floatTime) * 0.5;
            } else {
                const fadeTime = existTime - (this.stayTime + 1.5);
                const fadeProgress = Math.min(1, fadeTime / 1.5);
                
                const spread = Math.pow(fadeProgress, 2) * 30;
                const spreadX = Math.cos(this.fadeOutAngle) * spread * this.fadeOutSpeed;
                const spreadY = Math.sin(this.fadeOutAngle) * spread * this.fadeOutSpeed;
                
                this.x = this.targetX + spreadX;
                this.y = this.targetY + spreadY + fadeProgress * 8;
                
                this.opacity = Math.max(0, 1 - Math.pow(fadeProgress, 1.5));
                
                if (this.opacity <= 0) {
                    this.life = 0;
                }
            }
        } else {
            const currentConfig = getCurrentConfig();
            this.history.push({ x: this.x, y: this.y });
            if(this.history.length > this.trailLength) {
                this.history.splice(0, this.history.length - this.trailLength);
            }
            
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + currentConfig.gravity;
            this.speed *= 0.98;
            this.life -= currentConfig.fadeSpeed / 100;
            this.opacity = Math.max(0, this.life / 2);
        }
    }

    draw() {
        if(this.opacity <= 0.1) return;
        const currentConfig = getCurrentConfig();

        if (this.isTextParticle) {
            ctx.globalAlpha = this.opacity * (isMobileDevice() ? 0.5 : 1);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            if (isMobileDevice() && this.opacity <= 0) return;

            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            if (this.life < 1 && currentConfig.heartEffectEnabled) {
                this.drawHeart();
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                for (let i = this.history.length - 1; i >= 0; i--) {
                    const point = this.history[i];
                    ctx.lineTo(point.x, point.y);
                }
                ctx.strokeStyle = this.color;
                ctx.stroke();
            }
        }
    }

    drawHeart() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const isLandscape = window.innerWidth > window.innerHeight;
        let scale;
        if(isMobileDevice()) {
            if(isLandscape) {
                scale = 0.06;
            } else {
                scale = 0.08;
            }
        } else {
            scale = 0.1;
        }
        
        ctx.scale(scale, scale);
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.bezierCurveTo(-25, -80, -50, -50, 0, 0);
        ctx.bezierCurveTo(50, -50, 25, -80, 0, -50);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}
    
class TrailParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.alpha = 1;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.alpha *= 0.92;
        this.size *= 0.96;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
} 