// onetimers.js
let onetimers = {};

function setDefaultOnetimers(isPrestige=false) {
    fetch('data/onetimers.json')
        .then(response => response.json())
        .then(data => {
            Object.keys(data).forEach(key => {
                onetimers[key] = data[key];
                // Convert string methods to actual functions
                onetimers[key].checkIfCanUnlock = new Function(`return ${data[key].checkIfCanUnlock}`);
                onetimers[key].checkIfCanBuy = new Function(`return ${data[key].checkIfCanBuy}`);
                onetimers[key].bought = new Function(data[key].bought);
            });
            generateOnetimerButtons();
            addClickFunctionsToOnetimers();
            checkOnetimersAppearance();
            if (isPrestige) {
                onetimers.unlockprestige.isBought = true;
            }
        });
}
setDefaultOnetimers();

function generateOnetimerButtons() {
    const container = document.getElementById('onetimers');
    Object.entries(onetimers).forEach(([key, value]) => {
        const button = document.createElement('button');
        button.id = value.id;
        button.classList.add('hidden');
        button.innerHTML = `${value.title}<br><small>${value.text}</small>`;
        container.appendChild(button);
    });
}

function addClickFunctionsToOnetimers() {
    Object.entries(onetimers).forEach(([key, value]) => {
        document.getElementById(value.id).addEventListener('click', value.bought);
    });
}

function checkOnetimersAppearance() {
    let isAnyAvailable = false;

    Object.entries(onetimers).forEach(([key, value]) => {
        const element = document.getElementById(value.id);

        if (value.isBought) {
            element.classList.add('hidden');
            return;
        }

        const canUnlock = value.checkIfCanUnlock();
        const canBuy = value.checkIfCanBuy();

        if (canUnlock) {
            element.classList.remove('hidden');
            isAnyAvailable = true;
        } else {
            element.classList.add('hidden');
        }

        element.classList.toggle('affordable', canBuy);
        element.classList.toggle('unaffordable', !canBuy);
    });

    const onetimersDiv = document.getElementById('onetimers-div');
    if (isAnyAvailable) {
        onetimersDiv.classList.remove('onetimers-empty');
    } else {
        onetimersDiv.classList.add('onetimers-empty');
    }
}

