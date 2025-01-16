const config = {
    particleCount: 500,
    launchInterval: 200,
    risingSpeed: 10,
    fadeSpeed: 5,
    maxFireworks: 20,
    gravity: 0.05,
    soundEnabled: true,
    volume: 0.1,
    heartEffectEnabled: true,
    secondaryEnabled: true,
    secondaryChance: 0.3,
    secondaryParticleRatio: 0.2,
    textParticles: {
        enabled: false,
        probability: 0.1,
        texts: [  
            "新年快乐"
        ],
        fontSize: 120,
        color: "#ff8888",
        particleSize: 2,
        particleSpacing: 3
    }
};

const mobileConfig = {
    particleCount: 300,
    launchInterval: 400,
    risingSpeed: 8,
    fadeSpeed: 5,
    maxFireworks: 10,
    gravity: 0.05,
    soundEnabled: true,
    volume: 0.1,
    heartEffectEnabled: true,
    secondaryEnabled: true,
    secondaryChance: 0.3,
    secondaryParticleRatio: 0.2,
    textParticles: {
        enabled: false,
        probability: 0.1,
        texts: [  
            "新年快乐"
        ],
        fontSize: 120,
        color: "#ff8888",
        particleSize: 2,
        particleSpacing: 3
    }
};

const TEXT_POSITION_COOLDOWN = 2000;
const TEXT_POSITION_THRESHOLD = 400; 