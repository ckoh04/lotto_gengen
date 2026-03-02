
const generateBtn = document.getElementById("generate-btn");
const mainNumbersContainer = document.getElementById("main-numbers-container");
const powerballOptions = document.getElementById("powerball-options");
const powerPlayContainer = document.getElementById("power-play-container");
const doublePlayContainer = document.getElementById("double-play-container");
const doublePlayNumbersContainer = document.getElementById("double-play-numbers-container");
const themeToggle = document.getElementById("theme-toggle");
const businessInquiryToggle = document.getElementById("business-inquiry-toggle");
const partnershipSection = document.getElementById("partnership-section");

const THEME_STORAGE_KEY = "lottery_theme";

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
    radio.addEventListener("change", () => {
        updateLotteryOptionsVisibility();
    });
});

themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
});

businessInquiryToggle.addEventListener("click", () => {
    const isHidden = partnershipSection.classList.toggle("is-hidden");
    businessInquiryToggle.setAttribute("aria-expanded", String(!isHidden));
    businessInquiryToggle.textContent = isHidden ? "Business Inquiry" : "Hide Business Inquiry";
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

function updateLotteryOptionsVisibility() {
    const selectedLottery = document.querySelector("input[name='lottery']:checked").value;
    powerballOptions.style.display = selectedLottery === "powerball" ? "block" : "none";
}

function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.textContent = `${nextTheme.charAt(0).toUpperCase()}${nextTheme.slice(1)} Mode`;
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
}

applyTheme(getPreferredTheme());
updateLotteryOptionsVisibility();
