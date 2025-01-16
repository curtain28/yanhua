function isMobileDevice() {
    return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 1024
    );
}

function getCurrentConfig() {
    return isMobileDevice() ? mobileConfig : config;
}

function getTargetY() {
    if(isMobileDevice()) {
        const centerY = window.innerHeight / 2;
        const range = window.innerHeight * 0.45;
        const y = centerY + (Math.random() - 0.5) * range * 2;
        const maxY = window.innerHeight * 0.7;
        return Math.min(y, maxY);
    }
    return window.innerHeight * (0.1 + Math.random() * 0.6);
}

function getTargetX() {
    if(isMobileDevice()) {
        const centerX = window.innerWidth / 2;
        const range = window.innerWidth * 0.4;
        return centerX + (Math.random() - 0.5) * range * 2;
    }
    return window.innerWidth * Math.random();
}

function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function easeOutElastic(t) {
    const p = 0.8;
    const amplitude = 0.5;
    return amplitude * Math.pow(2, -8 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function radToDeg(rad) {
    return rad * 180 / Math.PI;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lerp(start, end, t) {
    return start + (end - start) * t;
} 