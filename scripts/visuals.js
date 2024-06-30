function updateResourceDisplay(resource) {
    document.getElementById(`${resource}-count`).innerText = formatNumber(resources[resource]);
    updateButtonStates();
}

function updateButtonStates() {
    buildingButtons.forEach(button => {
        const building = button.getAttribute('data-building');
        updateButtonState(button.id, buildingCosts[building]);
    });

    upgradeButtons.forEach(button => {
        const upgrade = button.getAttribute('data-upgrade');
        updateButtonState(button.id, upgradeCosts[upgrade]);
    });
}
function updateButtonState(buttonId, cost) {
    const button = document.getElementById(buttonId);
    if (canAfford(cost)) {
        button.classList.add('affordable');
        button.classList.remove('unaffordable');
    } else {
        button.classList.add('unaffordable');
        button.classList.remove('affordable');
    }
}

function getAffordableBuildings() {
    affordable = []
    buildingButtons.forEach(button => {
        const building = button.getAttribute('data-building');
        if (canAfford(buildingCosts[building])) {
            affordable.push(building)
        }
    });
    return affordable
}

function getAffordableUpgrades() {
    affordable = []
    upgradeButtons.forEach(button => {
        const building = button.getAttribute('data-upgrade');
        if (canAfford(upgradeCosts[building])) {
            affordable.push(building)
        }
    });
    return affordable
}

function updateUpgradeCosts() {
    upgradeButtons.forEach(button => {
        const upgrade = button.getAttribute('data-upgrade');
        let costString = "";
        
        Object.keys(upgradeCosts[upgrade]).forEach((key, index) => {
            costString += formatNumber(upgradeCosts[upgrade][key]) + " " + capitalize(key);
            if (index < Object.keys(upgradeCosts[upgrade]).length - 1) {
                costString += ", ";
            }
        });
        
        button.innerHTML = `Upgrade ${capitalize(upgrade)} (${upgrades[upgrade]})<br><small>${costString}</small>`;
    });
}