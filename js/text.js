let currentTextIndex = 0;

function getTextParticles(text, x, y, fontSize, spacing) {
    if(isMobileDevice()) {
        return [];
    }

    const currentTime = Date.now();
    if (currentTime - lastClickForTextTime < 5000) {
        return [];
    }

    const safeArea = {
        minX: window.innerWidth * 0.15,
        maxX: window.innerWidth * 0.85,
        minY: window.innerHeight * 0.15,
        maxY: window.innerHeight * 0.85
    };

    if (x < safeArea.minX || x > safeArea.maxX || 
        y < safeArea.minY || y > safeArea.maxY) {
        return [];
    }

    const particles = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.font = `${fontSize}px CustomFont`;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize;
    
    canvas.width = textWidth;
    canvas.height = textHeight;
    
    ctx.font = `${fontSize}px CustomFont`;
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'top';
    ctx.fillText(text, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    const gradientColors = getRandomGradientColors();
    
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] > 128) {
            const px = (i / 4) % canvas.width;
            const py = Math.floor((i / 4) / canvas.width);
            
            if (px % spacing === 0 && py % spacing === 0) {
                const progress = px / canvas.width;
                const hue1 = parseInt(gradientColors.start.match(/\d+/)[0]);
                const hue2 = parseInt(gradientColors.end.match(/\d+/)[0]);
                let hueDiff = hue2 - hue1;
                if (Math.abs(hueDiff) > 180) {
                    hueDiff = hueDiff > 0 ? hueDiff - 360 : hueDiff + 360;
                }
                const currentHue = (hue1 + hueDiff * progress + 360) % 360;
                const color = `hsl(${currentHue}, 90%, 55%)`;

                const randomRadius = 50 + Math.random() * 100;
                const randomAngle = Math.random() * Math.PI * 2;
                
                const particle = new Particle(
                    x + Math.cos(randomAngle) * randomRadius,
                    y + Math.sin(randomAngle) * randomRadius,
                    color,
                    Math.random() * Math.PI * 2,
                    0.1 + Math.random() * 0.2,
                    5
                );
                
                particle.targetX = x + px - textWidth / 2 + (Math.random() - 0.5) * 2;
                particle.targetY = y + py - textHeight / 2 + (Math.random() - 0.5) * 2;
                particle.initialX = particle.x;
                particle.initialY = particle.y;
                
                particle.isTextParticle = true;
                particles.push(particle);
            }
        }
    }

    return particles;
}

function initFont() {
    document.fonts.load('10px CustomFont').then(() => {
        console.log('自定义字体已加载');
    }).catch(err => {
        console.warn('自定义字体加载失败:', err);
    });
} 