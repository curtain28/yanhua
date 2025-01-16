const colorConfig = {
    colorSchemes: [
        ['#FF1493', '#FF69B4', '#FF00FF', '#FFB6C1', '#FF00E1', '#FF66FF'],
        ['#FFD700', '#FFA500', '#FF8C00', '#FFB90F', '#FFC125', '#FFD39B'],
        ['#9400D3', '#8A2BE2', '#9370DB', '#BA55D3', '#9932CC', '#BF3EFF'],
        ['#FF0000', '#FF2400', '#FF3030', '#FF4040', '#FF1111', '#FF3333'],
        ['#00BFFF', '#1E90FF', '#00B2EE', '#0000FF', '#0066FF', '#0033FF']
    ],
    
    hslConfig: {
        hueRanges: [
            [0, 60],
            [180, 240],
            [300, 360],
            [45, 105],
            [270, 330]
        ],
        minSaturation: 85,
        maxSaturation: 100,
        minLightness: 45,
        maxLightness: 65
    }
};

function getRandomColorScheme() {
    return colorConfig.colorSchemes[Math.floor(Math.random() * colorConfig.colorSchemes.length)];
}

function randomGradientColor() {
    if (Math.random() < 0.6) {
        const hueRange = colorConfig.hslConfig.hueRanges[
            Math.floor(Math.random() * colorConfig.hslConfig.hueRanges.length)
        ];
        
        const baseHue = hueRange[0] + Math.random() * (hueRange[1] - hueRange[0]);
        const hueDiff = (Math.random() * 20 + 10) * (Math.random() < 0.5 ? 1 : -1);
        const closeHue = (baseHue + hueDiff + 360) % 360;
        
        const saturation = colorConfig.hslConfig.minSaturation + 
            Math.random() * (colorConfig.hslConfig.maxSaturation - colorConfig.hslConfig.minSaturation);
        const lightness = colorConfig.hslConfig.minLightness + 
            Math.random() * (colorConfig.hslConfig.maxLightness - colorConfig.hslConfig.minLightness);

        return {
            type: 'hsl',
            startColor: `hsl(${baseHue}, ${saturation}%, ${lightness}%)`,
            endColor: `hsl(${closeHue}, ${saturation}%, ${lightness}%)`
        };
    } else {
        const scheme = getRandomColorScheme();
        const length = Math.min(3, scheme.length);
        const start = Math.floor(Math.random() * (scheme.length - length));
        const selectedColors = scheme.slice(start, start + length);
        
        return {
            type: 'preset',
            scheme: selectedColors,
            startColor: selectedColors[0],
            endColor: selectedColors[selectedColors.length - 1]
        };
    }
}

function generateRainbowColors(particleCount) {
    const colors = [];
    const scheme = getRandomColorScheme();
    
    for (let i = 0; i < particleCount; i++) {
        const index = (i / particleCount) * (scheme.length - 1);
        const leftIndex = Math.floor(index);
        const rightIndex = Math.ceil(index);
        const t = index - leftIndex;
        
        const color1 = scheme[leftIndex];
        const color2 = scheme[rightIndex];
        
        colors.push(interpolateColors(color1, color2, t));
    }
    
    return colors;
}

function interpolateColors(color1, color2, t) {
    if (color1.startsWith('hsl') && color2.startsWith('hsl')) {
        const hsl1 = parseHSL(color1);
        const hsl2 = parseHSL(color2);
        
        let hueDiff = hsl2.h - hsl1.h;
        if (Math.abs(hueDiff) > 180) {
            hueDiff = hueDiff > 0 ? hueDiff - 360 : hueDiff + 360;
        }
        
        const h = (hsl1.h + hueDiff * t + 360) % 360;
        const s = hsl1.s + (hsl2.s - hsl1.s) * t;
        const l = hsl1.l + (hsl2.l - hsl1.l) * t;
        
        return `hsl(${h}, ${s}%, ${l}%)`;
    }
    
    const rgb1 = parseRGB(color1);
    const rgb2 = parseRGB(color2);
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);
    
    return `rgb(${r},${g},${b})`;
}

function parseHSL(color) {
    const matches = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    return {
        h: parseInt(matches[1]),
        s: parseInt(matches[2]),
        l: parseInt(matches[3])
    };
}

function parseRGB(color) {
    if (color.startsWith('#')) {
        return {
            r: parseInt(color.slice(1, 3), 16),
            g: parseInt(color.slice(3, 5), 16),
            b: parseInt(color.slice(5, 7), 16)
        };
    }
    const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    return {
        r: parseInt(matches[1]),
        g: parseInt(matches[2]),
        b: parseInt(matches[3])
    };
}

function getRandomBrightColor() {
    const hue = Math.random() * 360;
    const saturation = 90 + Math.random() * 10;
    const lightness = 55 + Math.random() * 10;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getRandomGradientColors() {
    const baseHue = Math.random() * 360;
    const hueDiff = 15 + Math.random() * 30;
    const endHue = (baseHue + hueDiff) % 360;
    
    const saturation = 90 + Math.random() * 10;
    const lightness = 55 + Math.random() * 10;
    
    return {
        start: `hsl(${baseHue}, ${saturation}%, ${lightness}%)`,
        end: `hsl(${endHue}, ${saturation}%, ${lightness}%)`
    };
} 