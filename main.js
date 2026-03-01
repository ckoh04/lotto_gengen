
const generateBtn = document.getElementById("generate-btn");
const mainNumbersContainer = document.getElementById("main-numbers-container");
const powerballOptions = document.getElementById("powerball-options");
const powerPlayContainer = document.getElementById("power-play-container");
const doublePlayContainer = document.getElementById("double-play-container");
const doublePlayNumbersContainer = document.getElementById("double-play-numbers-container");

const lotteryRules = {
    "mega-millions": {
        count: 5,
        max: 70,
        specialMax: 25,
        specialName: "Mega Ball"
    },
    "powerball": {
        count: 5,
        max: 69,
        specialMax: 26,
        specialName: "Powerball"
    }
};

document.querySelectorAll("input[name='lottery']").forEach(radio => {
    radio.addEventListener("change", (event) => {
        if (event.target.value === "powerball") {
            powerballOptions.style.display = "block";
        } else {
            powerballOptions.style.display = "none";
        }
    });
});

generateBtn.addEventListener("click", () => {
    clearResults();
    const selectedLottery = document.querySelector("input[name='lottery']:checked").value;
    const rules = lotteryRules[selectedLottery];
    const mainNumbers = generateNumbers(rules.count, rules.max, rules.specialMax);
    displayNumbers(mainNumbers, rules.specialName, mainNumbersContainer);

    if (selectedLottery === "powerball") {
        const powerPlayChecked = document.getElementById("power-play").checked;
        const doublePlayChecked = document.getElementById("double-play").checked;

        if (powerPlayChecked) {
            const multiplier = generatePowerPlay();
            displayPowerPlay(multiplier);
        }

        if (doublePlayChecked) {
            const doublePlayNumbers = generateNumbers(rules.count, rules.max, rules.specialMax);
            displayDoublePlay(doublePlayNumbers, rules.specialName);
            doublePlayContainer.style.display = "block";
        }
    }
});

function generateNumbers(count, max, specialMax) {
    const regularNumbers = [];
    while (regularNumbers.length < count) {
        const randomNumber = Math.floor(Math.random() * max) + 1;
        if (!regularNumbers.includes(randomNumber)) {
            regularNumbers.push(randomNumber);
        }
    }
    regularNumbers.sort((a, b) => a - b);

    const specialNumber = Math.floor(Math.random() * specialMax) + 1;

    return { regularNumbers, specialNumber };
}

function displayNumbers(numbers, specialName, container) {
    container.innerHTML = "";

    numbers.regularNumbers.forEach(number => {
        const numberDiv = document.createElement("div");
        numberDiv.className = "number";
        numberDiv.textContent = number;
        container.appendChild(numberDiv);
    });

    const specialNumberDiv = document.createElement("div");
    specialNumberDiv.className = "number special";
    specialNumberDiv.textContent = numbers.specialNumber;
    specialNumberDiv.title = specialName;
    container.appendChild(specialNumberDiv);
}

function generatePowerPlay() {
    const multipliers = [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5, 10]; // Approximate distribution
    const randomIndex = Math.floor(Math.random() * multipliers.length);
    return multipliers[randomIndex];
}

function displayPowerPlay(multiplier) {
    powerPlayContainer.textContent = `Power Play: ${multiplier}x`;
}

function displayDoublePlay(numbers, specialName) {
    displayNumbers(numbers, specialName, doublePlayNumbersContainer);
}

function clearResults() {
    mainNumbersContainer.innerHTML = "";
    powerPlayContainer.innerHTML = "";
    doublePlayContainer.style.display = "none";
    doublePlayNumbersContainer.innerHTML = "";
}
