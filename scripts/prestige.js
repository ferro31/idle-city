let prestigeUnlocked = false;
let prestigeUpgrades = {};
let autoBuildingIntervalID = null;
let autoUpgradeIntervalID = null;

function fetchData() {
    fetch('data/prestigeUpgrades.json')
        .then(response => response.json())
        .then(data => {
            Object.keys(data).forEach(category => {
                prestigeUpgrades[category] = {};
                Object.keys(data[category]).forEach(subKey => {
                    prestigeUpgrades[category][subKey] = data[category][subKey];
                    prestigeUpgrades[category][subKey].checkIfCanUnlock = new Function(`return ${data[category][subKey].checkIfCanUnlock}`);
                    prestigeUpgrades[category][subKey].checkIfCanBuy = new Function(`return ${data[category][subKey].checkIfCanBuy}`);
                    prestigeUpgrades[category][subKey].bought = new Function(data[category][subKey].bought);
                });
            });
            generateMainMenu();
            generatePrestigeButtons();
            addClickFunctionsToUpgradeButtons();
        })
        .catch(error => console.error('Error fetching data:', error));
}

function calculatePP() {
    resources.ppToGain = (Math.cbrt(resources.wood, resources.stone, resources.food) ** 0.99);
    document.getElementById('pp-count').innerHTML = formatNumber(resources.ppToGain);
}

function prestige() {
    resources.pp += resources.ppToGain;
    setDefaultResources(true);
    setDefaultBuildings();
    setDefaultUpgrades();
    const onetimerContainer = document.getElementById('onetimers');
    onetimerContainer.innerHTML = '';
    setDefaultOnetimers(true);
    checkPrestigeButtonsAppearance();
}

function unlockPrestige() {
    prestigeUnlocked = true;
    document.getElementById('nav-prestige').classList.remove('hidden');
}

function generateMainMenu() {
    const mainMenu = document.getElementById('main-menu');
    if (!mainMenu) return;
    Object.keys(prestigeUpgrades).forEach(category => {
        const button = document.createElement('button');
        button.id = `${category}-menu-button`;
        button.innerText = category.charAt(0).toUpperCase() + category.slice(1);
        button.addEventListener('click', () => generateSubMenu(category));
        mainMenu.appendChild(button);
    });
}

function generateSubMenu(category) {
    const subMenus = document.getElementById('sub-menus');
    if (!subMenus) return;
    subMenus.innerHTML = '';  // Clear previous submenu
    const categoryData = prestigeUpgrades[category];

    Object.entries(categoryData).forEach(([key, value]) => {
        const button = document.createElement('button');
        button.id = value.id;
        button.innerHTML = `${value.title}<br><small>${value.text.replace('currentValue', value.currentValue)}</small>`;
        button.addEventListener('click', () => {
            value.bought();
            if (value.id === "autobuilding-prestige") {
                updateAutoBuildingInterval(value.currentValue);
            } else if (value.id === "autoupgrade-prestige") {
                updateAutoUpgradeInterval(value.currentValue);
            }
        });
        subMenus.appendChild(button);
    });

    checkPrestigeButtonsAppearance();
    updateUpgradeButtons();
}

function createOrUpdateButton(upgrade) {
    const button = document.getElementById(upgrade.id) || document.createElement('button');
    button.id = upgrade.id;

    if (upgrade.level >= upgrade.maxLevel) {
        button.innerHTML = `${upgrade.title} (Max)<br><small>${upgrade.text.replace('currentValue', upgrade.currentValue)}</small>`;
        button.style.backgroundColor = 'rgb(127, 127, 0)';
    } else {
        button.innerHTML = `${upgrade.title} (${upgrade.level}/${upgrade.maxLevel})<br><small>${upgrade.text.replace('currentValue', upgrade.currentValue)}</small>`;
    }

    if (!document.getElementById(upgrade.id)) {
        const container = document.getElementById('prestige-buttons-container');
        container.appendChild(button);
    }
}

function generatePrestigeButtons() {
    const container = document.getElementById('prestige-buttons-container');
    if (!container) return;
    Object.entries(prestigeUpgrades).forEach(([key, categoryData]) => {
        Object.entries(categoryData).forEach(([subKey, value]) => {
            createOrUpdateButton(value);
        });
    });
}

function checkPrestigeButtonsAppearance() {
    Object.values(prestigeUpgrades).forEach(categoryData => {
        Object.values(categoryData).forEach(upgrade => {
            const element = document.getElementById(upgrade.id);
            if (!element) return;
            const canUnlock = upgrade.checkIfCanUnlock();
            const canBuy = upgrade.checkIfCanBuy();

            if (canUnlock) {
                element.classList.remove('hidden');
            }
            element.classList.toggle('affordable', canBuy);
            element.classList.toggle('unaffordable', !canBuy);

            createOrUpdateButton(upgrade);
        });
    });
}

function addClickFunctionsToUpgradeButtons() {
    const prestigeButton = document.getElementById('prestige-button');
    if (prestigeButton) {
        prestigeButton.addEventListener('click', prestige);
    }
    Object.values(prestigeUpgrades).forEach(categoryData => {
        Object.values(categoryData).forEach(value => {
            const button = document.getElementById(value.id);
            if (button) {
                button.addEventListener('click', () => {
                    value.bought();
                    if (value.id === "autobuilding-prestige") {
                        updateAutoBuildingInterval(value.currentValue);
                    } else if (value.id === "autoupgrade-prestige") {
                        updateAutoUpgradeInterval(value.currentValue);
                    }
                });
            }
        });
    });
}

function updateUpgradeButtons() {
    Object.values(prestigeUpgrades).forEach(categoryData => {
        Object.values(categoryData).forEach(value => {
            const button = document.getElementById(value.id);
            if (button) {
                button.innerHTML = `${value.title} (${formatNumber(value.level)})<br><small>${value.text.replace('currentValue', roundToOneDecimals(value.currentValue))}</small>`;
                const costElement = document.getElementById(`prestige-${value.id}-cost`);
                if (costElement) {
                    costElement.innerHTML = formatNumber(value.pp);
                }
            }
        });
    });
}

function updateAutoBuildingInterval(currentValue) {
    if (autoBuildingIntervalID) {
        clearInterval(autoBuildingIntervalID);
    }
    autoBuildingIntervalID = setInterval(() => {
        autoBuyBuildings();
    }, currentValue * 1000); // Convert seconds to milliseconds
}

function updateAutoUpgradeInterval(currentValue) {
    if (autoUpgradeIntervalID) {
        clearInterval(autoUpgradeIntervalID);
    }
    autoUpgradeIntervalID = setInterval(() => {
        autoBuyUpgrades();
    }, currentValue * 1000); // Convert seconds to milliseconds
}

function roundToOneDecimals(num) {
    return Math.round(num * 10) / 10;
}

document.addEventListener('DOMContentLoaded', fetchData);
