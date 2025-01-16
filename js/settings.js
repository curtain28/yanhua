const settingsToggle = document.getElementById('settings-toggle');
const settingsContent = document.querySelector('.settings-content');
const particleCountInput = document.getElementById('particleCount');
const launchIntervalInput = document.getElementById('launchInterval');
const risingSpeedInput = document.getElementById('risingSpeed');
const fadeSpeedInput = document.getElementById('fadeSpeed');
const maxFireworksInput = document.getElementById('maxFireworks');
const gravityInput = document.getElementById('gravity');
const heartEffectToggle = document.getElementById('heartEffectToggle');
const secondaryExplosionToggle = document.getElementById('secondaryExplosionToggle');
const secondaryExplosionChance = document.getElementById('secondaryExplosionChance');
const secondaryParticleRatio = document.getElementById('secondaryParticleRatio');
const textEffectToggle = document.getElementById('textEffectToggle');
const textProbability = document.getElementById('textProbability');
const mainFontSize = document.getElementById('mainFontSize');
function initSettingsValues() {
    const currentConfig = getCurrentConfig();
    const isMobile = isMobileDevice();
    
    document.getElementById('particleCount').value = currentConfig.particleCount;
    document.getElementById('particleCountValue').textContent = currentConfig.particleCount;
    
    document.getElementById('launchInterval').value = currentConfig.launchInterval;
    document.getElementById('launchIntervalValue').textContent = currentConfig.launchInterval;
    
    document.getElementById('risingSpeed').value = currentConfig.risingSpeed;
    document.getElementById('risingSpeedValue').textContent = currentConfig.risingSpeed;
    
    document.getElementById('fadeSpeed').value = currentConfig.fadeSpeed;
    document.getElementById('fadeSpeedValue').textContent = currentConfig.fadeSpeed;
    
    document.getElementById('maxFireworks').value = currentConfig.maxFireworks;
    document.getElementById('maxFireworksValue').textContent = currentConfig.maxFireworks;
    
    document.getElementById('gravity').value = currentConfig.gravity;
    document.getElementById('gravityValue').textContent = currentConfig.gravity;
    
    document.getElementById('heartEffectToggle').checked = currentConfig.heartEffectEnabled;
    document.getElementById('secondaryExplosionToggle').checked = currentConfig.secondaryEnabled;
    document.getElementById('secondaryExplosionChance').value = currentConfig.secondaryChance * 100;
    document.getElementById('secondaryExplosionChanceValue').textContent = currentConfig.secondaryChance * 100;
    
    document.getElementById('secondaryParticleRatio').value = currentConfig.secondaryParticleRatio * 100;
    document.getElementById('secondaryParticleRatioValue').textContent = currentConfig.secondaryParticleRatio * 100;
    
    const textEffectGroup = document.querySelector('.settings-group:nth-child(4)');
    if (isMobile) {
        textEffectGroup.style.display = 'none';
    } else {
        textEffectGroup.style.display = 'block';
        document.getElementById('textEffectToggle').checked = currentConfig.textParticles.enabled;
        document.getElementById('textProbability').value = currentConfig.textParticles.probability * 100;
        document.getElementById('textProbabilityValue').textContent = currentConfig.textParticles.probability * 100;
        document.getElementById('mainFontSize').value = currentConfig.textParticles.fontSize;
        document.getElementById('mainFontSizeValue').textContent = currentConfig.textParticles.fontSize;
    }
    
    document.getElementById('soundToggle').checked = currentConfig.soundEnabled;
    document.getElementById('soundVolume').value = currentConfig.volume;
    document.getElementById('soundVolumeValue').textContent = currentConfig.volume;
}
function updateValueDisplay(input, valueId) {
    document.getElementById(valueId).textContent = input.value;
}

settingsToggle.addEventListener('click', () => {
    const isHidden = !settingsContent.classList.contains('show');
    
    settingsToggle.classList.remove('rotating');
    void settingsToggle.offsetWidth;
    settingsToggle.classList.add('rotating');
    
    if (isHidden) {
        settingsContent.classList.add('show');
    } else {
        settingsContent.classList.remove('show');
    }
});

settingsToggle.addEventListener('animationend', function(e) {
    if (e.animationName === 'rotate360') {
        this.classList.remove('rotating');
    }
});

settingsToggle.addEventListener('touchstart', (e) => {
    e.preventDefault();
    settingsToggle.click();
});

particleCountInput.addEventListener('input', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.particleCount = parseInt(e.target.value);
    updateValueDisplay(particleCountInput, 'particleCountValue');
});

launchIntervalInput.addEventListener('input', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.launchInterval = parseInt(e.target.value);
    updateValueDisplay(launchIntervalInput, 'launchIntervalValue');
    clearInterval(autoLaunchInterval);
    autoLaunchInterval = setInterval(autoLaunch, currentConfig.launchInterval);
});

risingSpeedInput.addEventListener('input', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.risingSpeed = parseInt(e.target.value);
    updateValueDisplay(risingSpeedInput, 'risingSpeedValue');
});

fadeSpeedInput.addEventListener('input', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.fadeSpeed = parseInt(e.target.value);
    updateValueDisplay(fadeSpeedInput, 'fadeSpeedValue');
});

maxFireworksInput.addEventListener('input', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.maxFireworks = parseInt(e.target.value);
    updateValueDisplay(maxFireworksInput, 'maxFireworksValue');
});

gravityInput.addEventListener('input', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.gravity = parseFloat(e.target.value);
    updateValueDisplay(gravityInput, 'gravityValue');
});

heartEffectToggle.addEventListener('change', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.heartEffectEnabled = e.target.checked;
});

secondaryExplosionToggle.addEventListener('change', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.secondaryEnabled = e.target.checked;
});

secondaryExplosionChance.addEventListener('input', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.secondaryChance = parseInt(e.target.value) / 100;
    updateValueDisplay(secondaryExplosionChance, 'secondaryExplosionChanceValue');
});

secondaryParticleRatio.addEventListener('input', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.secondaryParticleRatio = parseInt(e.target.value) / 100;
    updateValueDisplay(secondaryParticleRatio, 'secondaryParticleRatioValue');
});

textEffectToggle.addEventListener('change', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.textParticles.enabled = e.target.checked;
});

textProbability.addEventListener('input', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.textParticles.probability = parseInt(e.target.value) / 100;
    updateValueDisplay(textProbability, 'textProbabilityValue');
});

mainFontSize.addEventListener('input', (e) => {
    const currentConfig = getCurrentConfig();
    currentConfig.textParticles.fontSize = parseInt(e.target.value);
    updateValueDisplay(mainFontSize, 'mainFontSizeValue');
});

document.addEventListener('DOMContentLoaded', () => {
    initSettingsValues();

    const soundToggle = document.getElementById('soundToggle');
    const soundVolume = document.getElementById('soundVolume');

    if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
            const currentConfig = getCurrentConfig();
            currentConfig.soundEnabled = e.target.checked;
        });
    }

    if (soundVolume) {
        soundVolume.addEventListener('input', (e) => {
            const currentConfig = getCurrentConfig();
            currentConfig.volume = parseFloat(e.target.value);
            updateValueDisplay(soundVolume, 'soundVolumeValue');
        });
    }
}); 