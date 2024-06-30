let resources = {};
let resourcesPerClick = {};

function setDefaultResources(isPrestige=false) {
    fetch('data/resourcesPerClick.json')
        .then(response => response.json())
        .then(data => {
            resourcesPerClick = data;
        });
    if (isPrestige) {
        resources.wood = 0;
        resources.food = 0;
        resources.stone = 0;
        return;
    }
    fetch('data/resources.json')
    .then(response => response.json())
    .then(data => {
        resources = data;
    });
}
setDefaultResources();
initializeEventListeners();

function initializeEventListeners() {
    document.getElementById('wood').addEventListener('click', () => {
        const woodMultiplierPrestige = (1 + prestigeUpgrades.boosts.woodmulti1.level * 1.5) * (2 **  prestigeUpgrades.boosts.woodclick1.level)
        resources.wood += resourcesPerClick.wood * (onetimers.woodall1.isBought ? 1.4 : 1) * (onetimers.woodall2.isBought ? 1.8923 : 1) * woodMultiplierPrestige;
        updateVisuals();
    });

    document.getElementById('stone').addEventListener('click', () => {
        const stoneMultiplierPrestige = (1 + prestigeUpgrades.boosts.stonemulti1.level * 1.5) * (2 **  prestigeUpgrades.boosts.stoneclick1.level)
        resources.stone += resourcesPerClick.stone * (onetimers.stoneall2.isBought ? 1.4 : 1) * (onetimers.stoneall2.isBought ? 1.8923 : 1) * stoneMultiplierPrestige;
        updateVisuals();
    });

    document.getElementById('food').addEventListener('click', () => {
        const foodMultiplierPrestige = (1 + prestigeUpgrades.boosts.foodmulti1.level * 1.5) * (2 **  prestigeUpgrades.boosts.foodclick1.level)
        resources.food += resourcesPerClick.food * (onetimers.foodall1.isBought ? 1.4 : 1) * (onetimers.foodall2.isBought ? 1.8923 : 1) * foodMultiplierPrestige;
        updateVisuals();
    });
}

function incrementResource(resource, amount) {
    resources[resource] += amount;
    updateResourceDisplay(resource);
    calculatePP();
}