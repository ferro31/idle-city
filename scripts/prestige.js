prestigeuUnlocked = false;

let prestigeUpgrades = {};

fetch('data/prestigeUpgrades.json')
    .then(response => response.json())
    .then(data => {
        Object.keys(data).forEach(key => {
            prestigeUpgrades[key] = data[key];
            prestigeUpgrades[key].checkIfCanUnlock = new Function(`return ${data[key].checkIfCanUnlock}`);
            prestigeUpgrades[key].checkIfCanBuy = new Function(`return ${data[key].checkIfCanBuy}`);
            prestigeUpgrades[key].bought = new Function(data[key].bought);
        });
        generatePrestigeButtons();
        addClickFunctionsToUpgradeButtons();
    });

function calculatePP() {
    resources.ppToGain = (Math.cbrt(resources.wood, resources.stone, resources.food) ** 0.99)
  
    document.getElementById('pp-count').innerHTML = formatNumber(resources.ppToGain)
}

function prestige() {
    resources.pp += resources.ppToGain

    setDefaultResources(true);
    setDefaultBuildings();
    setDefaultUpgrades();
    const onetimerContainer = document.getElementById('onetimers');
    onetimerContainer.innerHTML = ''
    setDefaultOnetimers(true);
    checkPrestigeButtonsAppearance();
}

function unlockPrestige() {
    prestigeUnlocked = true;

    document.getElementById('nav-prestige').classList.remove('hidden')
}

function generatePrestigeButtons() {
    const container = document.getElementById('prestige-buttons-container');
    Object.entries(prestigeUpgrades).forEach(([key, value]) => {
        const button = document.createElement('button');
        button.id = value.id;
        button.classList.add('hidden');
        button.innerHTML = `${value.title}<br><small>${value.text}</small>`;
        container.appendChild(button);
    });
}

function checkPrestigeButtonsAppearance() {
    Object.entries(prestigeUpgrades).forEach(([key, value]) => {
        const element = document.getElementById(value.id);
        const canUnlock = value.checkIfCanUnlock();
        const canBuy = value.checkIfCanBuy();

        if (canUnlock) {
            element.classList.remove('hidden');
        }
        element.classList.toggle('affordable', canBuy);
        element.classList.toggle('unaffordable', !canBuy);
    });
}

function addClickFunctionsToUpgradeButtons() {
    document.getElementById('prestige-button').addEventListener('click', prestige)
    Object.entries(prestigeUpgrades).forEach(([key, value]) => {
        document.getElementById(value.id).addEventListener('click', value.bought);
    });
}

function updateUpgradeButtons() {
    Object.entries(prestigeUpgrades).forEach(([key, value]) => {
        document.getElementById(value.id).innerHTML = `${value.title} (${formatNumber(value.level)})<br><small>${value.text}</small>`;
        document.getElementById('prestige-' + key + "-cost").innerHTML = formatNumber(value.pp)
    });
}
