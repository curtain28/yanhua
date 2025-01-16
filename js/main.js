const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
const explosionSound = document.getElementById('explosion-sound');
const startPrompt = document.getElementById('start-prompt');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const risingFireworks = [];
let autoLaunchInterval = null;
let userInteractionTimer = null;
const CLICK_COOLDOWN = 100;
let lastClickTime = Date.now();
let lastClickForTextTime = 0;
let programStartTime = null;
let autoLaunchEnabled = true;
const textPositionHistory = [];

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    risingFireworks.forEach((firework, index) => {
        if (firework.update()) {
            risingFireworks.splice(index, 1);
        }
        firework.draw();
    });
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });
    requestAnimationFrame(animate);
}

function createFirework(x, y) {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < CLICK_COOLDOWN) return;
    lastClickTime = currentTime;
    lastClickForTextTime = currentTime;

    const isMobile = isMobileDevice();
    const currentConfig = getCurrentConfig();
    
    if(!isMobile) {
        const minY = window.innerHeight * 0.1;
        const maxY = window.innerHeight * 0.7;
        y = Math.max(minY, Math.min(maxY, y));
    }

    const maxFireworks = currentConfig.maxFireworks;
    const mainFireworksCount = fireworks.filter(fw => !fw.isSecondary).length + risingFireworks.length;
    
    if (mainFireworksCount < maxFireworks + 5) {
        if (autoLaunchInterval) {
            clearInterval(autoLaunchInterval);
            autoLaunchInterval = null;
        }
        autoLaunchEnabled = false;
        
        const risingFirework = new RisingFirework(
            x,
            canvas.height,
            y,
            currentConfig.risingSpeed * 1.2
        );
        risingFireworks.push(risingFirework);

        if (window.autoLaunchTimeout) {
            clearTimeout(window.autoLaunchTimeout);
        }
        
        window.autoLaunchTimeout = setTimeout(() => {
            if (!autoLaunchEnabled) {
                autoLaunchEnabled = true;
                autoLaunchInterval = setInterval(autoLaunch, currentConfig.launchInterval);
            }
        }, 1000);
    }
}

function autoLaunch() {
    if (!autoLaunchEnabled) return;
    
    const currentConfig = getCurrentConfig();
    const maxFireworks = currentConfig.maxFireworks;
    const mainFireworksCount = fireworks.filter(fw => !fw.isSecondary).length + risingFireworks.length;
    
    if (mainFireworksCount < maxFireworks) {
        const fireworksToLaunch = Math.min(
            maxFireworks - mainFireworksCount,
            isMobileDevice() ? 1 : 3
        );
        
        for (let i = 0; i < fireworksToLaunch; i++) {
            let xPosition = getTargetX();
            const targetYPosition = getTargetY();
            const risingFirework = new RisingFirework(
                xPosition,
                canvas.height,
                targetYPosition,
                currentConfig.risingSpeed
            );
            risingFireworks.push(risingFirework);
        }
    }
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    createFirework(x, y);
}

function handleClick(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createFirework(x, y);
}

canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('click', handleClick);

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);

document.body.addEventListener('touchmove', (e) => {
    if (e.target === canvas) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('click', () => {
    if (startPrompt.style.display !== 'none') {
        startPrompt.style.display = 'none';
        programStartTime = Date.now();
        autoLaunchInterval = setInterval(autoLaunch, config.launchInterval);
    }
}, { once: true });

resizeCanvas();
initFont();
animate(); 