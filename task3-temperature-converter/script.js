// Variable to maintain conversion history
let conversionHistory = [];

function convertTemp() {
    const tempValue = document.getElementById("temperature").value;
    const unit = document.getElementById("unit").value;
    const warningBox = document.getElementById("validation-warning");

    // Output DOM Targets
    const labelOne = document.getElementById("label-one");
    const labelTwo = document.getElementById("label-two");
    const outputOne = document.getElementById("output-one");
    const outputTwo = document.getElementById("output-two");
    const formulaDisplay = document.getElementById("formula-display");

    // If input is empty, clear outputs
    if (tempValue === "") {
        resetOutputs();
        warningBox.textContent = "";
        return;
    }

    const temp = parseFloat(tempValue);

    if (isNaN(temp)) {
        warningBox.textContent = "⚠ Please enter a valid number.";
        resetOutputs();
        return;
    }

    // Absolute Zero physical limit checks
    if (unit === "celsius" && temp < -273.15) {
        warningBox.textContent = "⚠ Below Absolute Zero limit (-273.15 °C)";
        resetOutputs();
        return;
    }
    if (unit === "fahrenheit" && temp < -459.67) {
        warningBox.textContent = "⚠ Below Absolute Zero limit (-459.67 °F)";
        resetOutputs();
        return;
    }
    if (unit === "kelvin" && temp < 0) {
        warningBox.textContent = "⚠ Below Absolute Zero limit (0 K)";
        resetOutputs();
        return;
    }

    // Clear warnings if it passes validations
    warningBox.textContent = "";

    let finalOne = 0, finalTwo = 0;
    let labelOneText = "", labelTwoText = "";
    let formulaText = "";

    // Conversion mathematics
    if (unit === "celsius") {
        finalOne = (temp * 9/5) + 32;
        finalTwo = temp + 273.15;
        labelOneText = "Fahrenheit (°F)";
        labelTwoText = "Kelvin (K)";
        formulaText = `Fahrenheit: (${temp}°C × 9/5) + 32 = ${finalOne.toFixed(2)}°F \n| Kelvin: ${temp}°C + 273.15 = ${finalTwo.toFixed(2)}K`;
    } 
    else if (unit === "fahrenheit") {
        finalOne = (temp - 32) * 5/9;
        finalTwo = finalOne + 273.15;
        labelOneText = "Celsius (°C)";
        labelTwoText = "Kelvin (K)";
        formulaText = `Celsius: (${temp}°F − 32) × 5/9 = ${finalOne.toFixed(2)}°C \n| Kelvin: (${temp}°F − 32) × 5/9 + 273.15 = ${finalTwo.toFixed(2)}K`;
    } 
    else if (unit === "kelvin") {
        finalOne = temp - 273.15;
        finalTwo = (finalOne * 9/5) + 32;
        labelOneText = "Celsius (°C)";
        labelTwoText = "Fahrenheit (°F)";
        formulaText = `Celsius: ${temp}K − 273.15 = ${finalOne.toFixed(2)}°C \n| Fahrenheit: (${temp}K − 273.15) × 9/5 + 32 = ${finalTwo.toFixed(2)}°F`;
    }

    // Populate Results
    labelOne.textContent = labelOneText;
    labelTwo.textContent = labelTwoText;
    outputOne.textContent = `${finalOne.toFixed(2)}`;
    outputTwo.textContent = `${finalTwo.toFixed(2)}`;
    formulaDisplay.textContent = formulaText;

    // Save calculation to history list
    updateHistory(temp, unit, finalOne, labelOneText, finalTwo, labelTwoText);
}

function resetOutputs() {
    document.getElementById("output-one").textContent = "--";
    document.getElementById("output-two").textContent = "--";
    document.getElementById("formula-display").textContent = "Enter a temperature value to see the formula.";
}

function clearAll() {
    document.getElementById("temperature").value = "";
    document.getElementById("validation-warning").textContent = "";
    resetOutputs();
}

// Clipboard copying utility
function copyResult(elementId, buttonElement) {
    const textToCopy = document.getElementById(elementId).textContent;
    if (textToCopy === "--" || textToCopy === "") return;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalIcon = buttonElement.innerHTML;
        buttonElement.innerHTML = `<i class="fa-solid fa-check" style="color: #22c55e;"></i>`;
        setTimeout(() => {
            buttonElement.innerHTML = originalIcon;
        }, 1200);
    }).catch(err => {
        console.error("Copy operation failed: ", err);
    });
}

// Log history updating rules (maintaining 3 max items)
function updateHistory(inputVal, inputUnit, outOne, unitOneLabel, outTwo, unitTwoLabel) {
    const formattedUnit = inputUnit === "celsius" ? "°C" : inputUnit === "fahrenheit" ? "°F" : "K";
    const labelOneShort = unitOneLabel.includes("Celsius") ? "°C" : unitOneLabel.includes("Fahrenheit") ? "°F" : "K";
    const labelTwoShort = unitTwoLabel.includes("Celsius") ? "°C" : unitTwoLabel.includes("Fahrenheit") ? "°F" : "K";
    
    const entryText = `${inputVal}${formattedUnit} ➔ ${outOne.toFixed(1)}${labelOneShort} / ${outTwo.toFixed(1)}${labelTwoShort}`;
    
    // Prevent recording repetitive identical history steps
    if (conversionHistory.length > 0 && conversionHistory[0].text === entryText) {
        return;
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    conversionHistory.unshift({ text: entryText, time: timestamp });

    if (conversionHistory.length > 3) {
        conversionHistory.pop();
    }

    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";

    if (conversionHistory.length === 0) {
        historyList.innerHTML = `<li class="empty-history">No recent conversions</li>`;
        return;
    }

    conversionHistory.forEach(item => {
        const li = document.createElement("li");
        li.className = "history-item";
        li.innerHTML = `<span>${item.text}</span><span class="history-time">${item.time}</span>`;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    conversionHistory = [];
    renderHistory();
}

// Light & Dark Mode class toggle
function toggleMode() {
    const isDark = document.body.classList.toggle("dark");
    const themeBtn = document.getElementById("theme-toggle");

    if (isDark) {
        themeBtn.innerHTML = `<i class="fa-solid fa-sun" style="color: #f5b400;"></i> <span>Toggle Light Mode</span>`;
    } else {
        themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i> <span>Toggle Dark Mode</span>`;
    }
}
