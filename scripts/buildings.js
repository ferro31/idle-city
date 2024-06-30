// buildings.js
let buildingNames = [];
let buildings = {};
let buildingCosts = {};

let buildingButtons = document.querySelectorAll('[data-building]');
function setDefaultBuildings() {
    Promise.all([
        fetch('data/buildingNames.json').then(response => response.json()),
        fetch('data/buildingCosts.json').then(response => response.json())
    ]).then(([namesData, costsData]) => {
        buildingNames = namesData;
        buildingNames.forEach(name => {
            buildings[name] = 0;
        });
        buildingCosts = costsData;
    });
    buildingButtons = document.querySelectorAll('[data-building]');
}
setDefaultBuildings();
initializeBuildingEventListeners();


function initializeBuildingEventListeners() {
    buildingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const building = button.getAttribute('data-building');
            if (canAfford(buildingCosts[building])) {
                buyBuilding(building);
                updateVisuals();
            }
        });
    });
}

function canAfford(cost) {
    return Object.keys(cost).every(resource => resources[resource] >= cost[resource]);
}

function buyBuilding(building) {
    Object.keys(buildingCosts[building]).forEach(resource => {
        resources[resource] -= buildingCosts[building][resource];
    });
    buildings[building]++;
    Object.keys(buildingCosts[building]).forEach(resource => {
        buildingCosts[building][resource] = Math.floor(buildingCosts[building][resource] * 1.35);
    });
}

function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function updateBuildingCosts() {
    buildingButtons.forEach(button => {
        const building = button.getAttribute('data-building');
        let costString = "";
        
        Object.keys(buildingCosts[building]).forEach((key, index) => {
            costString += formatNumber(buildingCosts[building][key]) + " " + capitalize(key);
            if (index < Object.keys(buildingCosts[building]).length - 1) {
                costString += ", ";
            }
        });
        
        button.innerHTML = `Build ${capitalize(building)} (${buildings[building]})<br><small>${costString}</small>`;
    });
}
