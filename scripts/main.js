// main.js
let navigations = { production: "production", prestige: "prestige" }
let currentNav = navigations.production

document.getElementById('nav-production').addEventListener('click', () => {
    currentNav = navigations.production
    document.getElementById("body-main").classList.remove('hidden')
    document.getElementById("body-prestige").classList.add('hidden')
    document.getElementById("nav-production").classList.add('current-nav')
    document.getElementById("nav-prestige").classList.remove('current-nav')
    updateVisuals();
});

document.getElementById('nav-prestige').addEventListener('click', () => {
    currentNav = navigations.prestige
    document.getElementById("body-main").classList.add('hidden')
    document.getElementById("body-prestige").classList.remove('hidden')
    document.getElementById("nav-production").classList.remove('current-nav')
    document.getElementById("nav-prestige").classList.add('current-nav')
    updateVisuals();
});

function checkBuildingAppearance() {
    buildingButtons.forEach(button => {
        const building = button.getAttribute('data-building');
        if (canAfford(buildingCosts[building])) {
            if (document.getElementById('buildings-title-section').classList.contains('hidden')) {
                document.getElementById('buildings-title-section').classList.remove('hidden')
            }
            button.classList.remove('hidden');
        }
    });
}

function checkUpgradeAppearance() {
    upgradeButtons.forEach(button => {
        const upgrade = button.getAttribute('data-upgrade');
        if (buildings[upgrade] >= 1) {
            button.classList.remove('hidden');
            if (document.getElementById('upgrades').classList.contains('hidden')) {
                document.getElementById('upgrades').classList.remove('hidden')
            }
        }
    });
}

function updateVisuals() {
    updateResourceDisplay('food');
    updateResourceDisplay('wood');
    updateResourceDisplay('stone');
    updateRates();
    updateUpgradeCosts();
    checkOnetimersAppearance();
    updateBuildingCosts();
    updateButtonStates();
    updateUpgradeCosts();
    checkBuildingAppearance();
    checkUpgradeAppearance();
    checkPrestigeButtonsAppearance();
    updateUpgradeButtons();
}


function updateRates() {
    const woodBuildings = buildings.house * (1 + upgrades.house * 0.5)
                       + buildings.lumberMill * 3 * (1 + upgrades.lumberMill * 0.5)
                       + buildings.sawmill * 5 * (1 + upgrades.sawmill * 0.5)
                       + buildings.grove * 10 * (1 + upgrades.grove * 0.5);

    const woodMultiplier = (onetimers.woodsecond1.isBought ? 1.25 : 1) * (onetimers.woodsecond2.isBought ? 1.3 : 1) * (onetimers.woodall1.isBought ? 1.4 : 1) * (onetimers.woodall2.isBought ? 1.8923 : 1) * (onetimers.woodall3.isBought ? 2.3456 : 1);
    const woodMultiplierPrestige = 1 + prestigeUpgrades.woodmulti1.level * 1.5
    const woodRate = woodBuildings * woodMultiplier * woodMultiplierPrestige;

    const stoneBuildings = buildings.quarry * (1 + upgrades.quarry * 0.5)
                        + buildings.mine * 3 * (1 + upgrades.mine * 0.5)
                        + buildings.masonry * 5 * (1 + upgrades.masonry * 0.5)
                        + buildings.crystalMine * 10 * (1 + upgrades.crystalMine * 0.5);
    const stoneMultiplier = (onetimers.stonesecond1.isBought ? 1.25 : 1) * (onetimers.stonesecond2.isBought ? 1.3 : 1) * (onetimers.stoneall1.isBought ? 1.4 : 1) * (onetimers.stoneall2.isBought ? 1.8923 : 1) * (onetimers.stoneall3.isBought ? 2.3456 : 1);
    const stoneMultiplierPrestige = 1 + prestigeUpgrades.stonemulti1.level * 1.5
    const stoneRate = stoneBuildings * stoneMultiplier * stoneMultiplierPrestige;

    const foodBuildings = buildings.farm * (1 + upgrades.farm * 0.5)
                       + buildings.bakery * 3 * (1 + upgrades.bakery * 0.5)
                       + buildings.granary * 5 * (1 + upgrades.granary * 0.5)
                       + buildings.breedingFacility * 10 * (1 + upgrades.breedingFacility * 0.5);

    const foodMultiplier = (onetimers.foodsecond1.isBought ? 1.25 : 1) * (onetimers.foodsecond2.isBought ? 1.3 : 1) * (onetimers.foodall1.isBought ? 1.4 : 1) * (onetimers.foodall2.isBought ? 1.8923 : 1) * (onetimers.foodall3.isBought ? 2.3456 : 1);
    const foodMultiplierPrestige = 1 + prestigeUpgrades.foodmulti1.level * 1.5
    const foodRate = foodBuildings * foodMultiplier * foodMultiplierPrestige;

    document.getElementById('wood-rate').innerText = `(+${formatNumber(woodRate)}/s)`;
    document.getElementById('stone-rate').innerText = `(+${formatNumber(stoneRate)}/s)`;
    document.getElementById('food-rate').innerText = `(+${formatNumber(foodRate)}/s)`;

    const rates = {
        wood: woodRate,
        stone: stoneRate,
        food: foodRate,
    };
    return rates
}

let lastUpdateTime = performance.now();
function calculateDeltaTime() {
    const now = performance.now();
    const deltaTime = (now - lastUpdateTime) / 1000;
    lastUpdateTime = now;
    return deltaTime;
}

function autoGenerateResources() {
    const deltaTime = calculateDeltaTime();

    const rates = updateRates();
    Object.keys(rates).forEach(resource => {
        const resourceGenerated = rates[resource] * deltaTime;
        incrementResource(resource, resourceGenerated);
    });

    checkOnetimersAppearance();
}

setInterval(autoGenerateResources, 100);

addClickFunctionsToOnetimers();
