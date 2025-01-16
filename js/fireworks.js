
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.secondaryFireworks = [];
        this.init();
    }

    init() {
        const gradientColors = randomGradientColor();
        const currentConfig = getCurrentConfig();
        const isMobile = isMobileDevice();
        const isLandscape = window.innerWidth > window.innerHeight;
        
        for (let i = 0; i < currentConfig.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            let speed;
            let offsetX, offsetY;

            if(isMobile) {
                if(isLandscape) {
                    speed = Math.random() * 1.2 + 0.3;
                    offsetX = (Math.random() - 0.5) * 10;
                    offsetY = (Math.random() - 0.5) * 10;
                } else {
                    speed = Math.random() * 1.5 + 0.4;
                    offsetX = (Math.random() - 0.5) * 15;
                    offsetY = (Math.random() - 0.5) * 15;
                }
            } else {
                speed = Math.random() * 2 + 0.5;
                offsetX = (Math.random() - 0.5) * 20;
                offsetY = (Math.random() - 0.5) * 20;
            }

            const life = Math.random() * 3 + 2;

            let particleColor;
            if (gradientColors.type === 'hsl') {
                const t = i / currentConfig.particleCount;
                const startHue = parseInt(gradientColors.startColor.match(/\d+/)[0]);
                const endHue = parseInt(gradientColors.endColor.match(/\d+/)[0]);
                
                let hueDiff = endHue - startHue;
                if (Math.abs(hueDiff) > 180) {
                    hueDiff = hueDiff > 0 ? hueDiff - 360 : hueDiff + 360;
                }
                
                const hue = (startHue + hueDiff * t + 360) % 360;
                particleColor = `hsl(${hue}, 100%, 50%)`;
            } else {
                const scheme = gradientColors.scheme;
                const t = i / currentConfig.particleCount;
                const index = t * (scheme.length - 1);
                const leftIndex = Math.floor(index);
                const rightIndex = Math.ceil(index);
                const mixT = index - leftIndex;
                
                particleColor = interpolateColors(
                    scheme[leftIndex], 
                    scheme[rightIndex], 
                    mixT
                );
            }

            this.particles.push(new Particle(
                this.x + offsetX, 
                this.y + offsetY, 
                particleColor, 
                angle, 
                speed, 
                life
            ));
        }

        if (currentConfig.secondaryEnabled && Math.random() < currentConfig.secondaryChance) {
            const maxSecondaryCount = isMobile ? (isLandscape ? 2 : 3) : 3;
            const count = Math.floor(Math.random() * maxSecondaryCount) + 1;
            const secondaryScheme = getRandomColorScheme();
            
            for (let i = 0; i < count; i++) {
                const angle = (Math.random() * 1.5 + 0.25) * Math.PI;
                let speed;
                
                if(isMobile) {
                    if(isLandscape) {
                        speed = 2 + Math.random() * 1.5;
                    } else {
                        speed = 3 + Math.random() * 2;
                    }
                } else {
                    speed = 4 + Math.random() * 3;
                }
                
                this.secondaryFireworks.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 2,
                    color: secondaryScheme[Math.floor(Math.random() * secondaryScheme.length)],
                    timer: isMobile ? (isLandscape ? 15 : 18) : 20 + Math.random() * 15,
                    hasExploded: false,
                    trail: []
                });
            }
        }

        if (currentConfig.textParticles.enabled && 
            Math.random() < currentConfig.textParticles.probability && 
            !isMobileDevice()) {
            
            const currentTime = Date.now();
            
            if (programStartTime && currentTime - programStartTime < 5000) {
                return;
            }
            
            while (textPositionHistory.length > 0 && 
                   currentTime - textPositionHistory[0].time > TEXT_POSITION_COOLDOWN) {
                textPositionHistory.shift();
            }

            const isPositionValid = !textPositionHistory.some(pos => {
                const dx = pos.x - this.x;
                const dy = pos.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < TEXT_POSITION_THRESHOLD;
            });

            if (isPositionValid) {
                textPositionHistory.push({
                    x: this.x,
                    y: this.y,
                    time: currentTime
                });

                const currentText = currentConfig.textParticles.texts[currentTextIndex];
                currentTextIndex = (currentTextIndex + 1) % currentConfig.textParticles.texts.length;

                const textParticles = getTextParticles(
                    currentText,
                    this.x,
                    this.y,
                    currentConfig.textParticles.fontSize,
                    currentConfig.textParticles.particleSpacing
                );
                
                this.particles.push(...textParticles);
            }
        }
    }

    update() {
        const currentConfig = getCurrentConfig();
        this.particles.forEach((particle, index) => {
            particle.update();
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });

        this.secondaryFireworks.forEach((secondary) => {
            if (!secondary.hasExploded) {
                secondary.trail.push({ x: secondary.x, y: secondary.y });
                if (secondary.trail.length > 10) {
                    secondary.trail.shift();
                }

                secondary.x += secondary.vx;
                secondary.y += secondary.vy;
                secondary.vy += currentConfig.gravity * 1.5;
                secondary.timer--;

                if (secondary.timer <= 0) {
                    secondary.hasExploded = true;
                    const particleCount = Math.floor(currentConfig.particleCount * currentConfig.secondaryParticleRatio);
                    for (let i = 0; i < particleCount; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 1.5 + 0.5;
                        const life = Math.random() * 2 + 1;
                        const particle = new Particle(
                            secondary.x,
                            secondary.y,
                            secondary.color,
                            angle,
                            speed,
                            life
                        );
                        this.particles.push(particle);
                    }
                }
            }
        });

        this.secondaryFireworks = this.secondaryFireworks.filter(secondary => !secondary.hasExploded);
    }

    draw() {
        this.particles.forEach(particle => particle.draw());

        this.secondaryFireworks.forEach(secondary => {
            if (!secondary.hasExploded) {
                ctx.beginPath();
                ctx.moveTo(secondary.x, secondary.y);
                secondary.trail.forEach(point => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.strokeStyle = secondary.color;
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(secondary.x, secondary.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = secondary.color;
                ctx.fill();
            }
        });
    }
}

class RisingFirework {
    constructor(x, y, targetY, speed) {
        const isMobile = isMobileDevice();
        const isLandscape = window.innerWidth > window.innerHeight;
        this.x = x;
        this.targetY = targetY;
        
        this.y = window.innerHeight;
        this.speed = speed;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.trailParticles = [];
        this.soundPlayed = false;
        
        if(isMobile) {
            if(isLandscape) {
                this.wobbleFrequency = Math.random() * 0.08 + 0.04;
                this.wobbleAmplitude = Math.random() * 0.3 + 0.1;
            } else {
                this.wobbleFrequency = Math.random() * 0.1 + 0.05;
                this.wobbleAmplitude = Math.random() * 0.4 + 0.1;
            }
        } else {
            this.wobbleFrequency = Math.random() * 0.2 + 0.1;
            this.wobbleAmplitude = Math.random() * 0.8 + 0.2;
        }
        
        this.time = 0;
        this.lastX = this.x;
        this.lastY = this.y;
    }

    update() {
        this.time += this.wobbleFrequency;
        
        const horizontalOffset = Math.sin(this.time) * this.wobbleAmplitude;
        
        this.x += horizontalOffset;
        this.y -= this.speed;
        
        const maxOffset = 30;
        if (Math.abs(this.x - this.lastX) > maxOffset) {
            this.x = this.lastX + (maxOffset * Math.sign(this.x - this.lastX));
        }

        const dx = this.x - this.lastX;
        const dy = this.y - this.lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const particleCount = Math.ceil(distance / 2);
        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            const particleX = this.lastX + dx * t;
            const particleY = this.lastY + dy * t;
            
            if (Math.random() < 0.3) {
                this.trailParticles.push(new TrailParticle(
                    particleX + (Math.random() - 0.5) * 2,
                    particleY + (Math.random() - 0.5) * 2,
                    this.color
                ));
            }
        }

        this.trailParticles.forEach((particle, index) => {
            particle.update();
            if (particle.alpha < 0.05) {
                this.trailParticles.splice(index, 1);
            }
        });

        this.lastX = this.x;
        this.lastY = this.y;

        if (!this.soundPlayed && this.y - this.targetY <= this.speed * 25) {
            const currentConfig = getCurrentConfig();
            if (currentConfig.soundEnabled) {
                const sound = explosionSound.cloneNode();
                explosionSound.volume = currentConfig.volume;
                sound.volume = currentConfig.volume;
                sound.play().catch(e => console.log('音效播放失败:', e));
            }
            this.soundPlayed = true;
        }

        if (this.y <= this.targetY) {
            fireworks.push(new Firework(this.x, this.y));
            return true;
        }
        return false;
    }

    draw() {
        this.trailParticles.forEach(particle => {
            particle.draw();
        });

        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, 8
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, 0.4)`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

