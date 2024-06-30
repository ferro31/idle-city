// upgrades.js
let upgrades = {};
let upgradeCosts = {};

let upgradeButtons = document.querySelectorAll('[data-upgrade]');
function setDefaultUpgrades() {
    fetch('data/upgradeCosts.json')
        .then(response => response.json())
        .then(data => {
            upgradeCosts = data;
            buildingNames.forEach(name => {
                upgrades[name] = 0;
            });
        });
    
    upgradeButtons = document.querySelectorAll('[data-upgrade]');
}
setDefaultUpgrades();
initializeUpgradeEventListeners();

function initializeUpgradeEventListeners() {
    upgradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const upgrade = button.getAttribute('data-upgrade');
            if (canAfford(upgradeCosts[upgrade])) {
                buyUpgrade(upgrade);
                updateVisuals();
            }
        });
    });
}

function buyUpgrade(upgrade) {
    Object.keys(upgradeCosts[upgrade]).forEach(resource => {
        resources[resource] -= upgradeCosts[upgrade][resource];
    });
    upgrades[upgrade]++;
    Object.keys(upgradeCosts[upgrade]).forEach(resource => {
        upgradeCosts[upgrade][resource] = Math.floor(upgradeCosts[upgrade][resource] * 1.35);
    });
}
