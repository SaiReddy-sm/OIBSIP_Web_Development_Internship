let conversionHistory = [];

function convertTemp() {
    const tempValue = document.getElementById("temperature").value;
    const unit = document.getElementById("unit").value;
    const warningBox = document.getElementById("validation-warning");

    // Output Elements
    const labelOne = document.getElementById("label-one");
    const labelTwo = document.getElementById("label-two");
    const outputOne = document.getElementById("output-one");
    const outputTwo = document.getElementById("output-two");
    const formulaDisplay = document.getElementById("formula-display");

    if (tempValue === "") {
        resetOutputs();
        warningBox.textContent = "";
        updateLevelMeter(null); // Reset meter to minimum
        return;
    }

    const temp = parseFloat(tempValue);

    if (isNaN(temp)) {
        warningBox.textContent = "⚠ Please enter a valid number.";
        resetOutputs();
        updateLevelMeter(null);
        return;
    }

    // Absolute Zero physical validation
    if (unit === "celsius" && temp < -273.15) {
        warningBox.textContent = "⚠ Below Absolute Zero limit (-273.15 °C)";
        resetOutputs();
        updateLevelMeter(null);
        return;
    }
    if (unit === "fahrenheit" && temp < -459.67) {
        warningBox.textContent = "⚠ Below Absolute Zero limit (-459.67 °F)";
        resetOutputs();
        updateLevelMeter(null);
        return;
    }
    if (unit === "kelvin" && temp < 0) {
        warningBox.textContent = "⚠ Below Absolute Zero limit (0 K)";
        resetOutputs();
        updateLevelMeter(null);
        return;
    }

    warningBox.textContent = "";

    let finalOne = 0, finalTwo = 0;
    let labelOneText = "", labelTwoText = "";
    let formulaText = "";
    let celsiusEquiv = 0;

    // Conversion Calculations
    if (unit === "celsius") {
        celsiusEquiv = temp;
        finalOne = (temp * 9/5) + 32;
        finalTwo = temp + 273.15;
        labelOneText = "Fahrenheit (°F)";
        labelTwoText = "Kelvin (K)";
        formulaText = `Fahrenheit: (${temp}°C × 9/5) + 32 = ${finalOne.toFixed(2)}°F\nKelvin: ${temp}°C + 273.15 = ${finalTwo.toFixed(2)}K`;
    } 
    else if (unit === "fahrenheit") {
        celsiusEquiv = (temp - 32) * 5/9;
        finalOne = celsiusEquiv;
        finalTwo = celsiusEquiv + 273.15;
        labelOneText = "Celsius (°C)";
        labelTwoText = "Kelvin (K)";
        formulaText = `Celsius: (${temp}°F − 32) × 5/9 = ${finalOne.toFixed(2)}°C\nKelvin: (${temp}°F − 32) × 5/9 + 273.15 = ${finalTwo.toFixed(2)}K`;
    } 
    else if (unit === "kelvin") {
        celsiusEquiv = temp - 273.15;
        finalOne = celsiusEquiv;
        finalTwo = (celsiusEquiv * 9/5) + 32;
        labelOneText = "Celsius (°C)";
        labelTwoText = "Fahrenheit (°F)";
        formulaText = `Celsius: ${temp}K − 273.15 = ${finalOne.toFixed(2)}°C\nFahrenheit: (${temp}K − 273.15) × 9/5 + 32 = ${finalTwo.toFixed(2)}°F`;
    }

    // Assign Results
    labelOne.textContent = labelOneText;
    labelTwo.textContent = labelTwoText;
    outputOne.textContent = `${finalOne.toFixed(2)}`;
    outputTwo.textContent = `${finalTwo.toFixed(2)}`;
    formulaDisplay.textContent = formulaText;

    // Update level scale meter
    updateLevelMeter(celsiusEquiv);

    // Save calculation
    updateHistory(temp, unit, finalOne, labelOneText, finalTwo, labelTwoText);
}

// Dynamic Thermal Level meter calculation logic
function updateLevelMeter(celsiusTemp) {
    const meterFill = document.getElementById("meter-fill");
    const meterStatus = document.getElementById("meter-status");
    const thermIcon = document.getElementById("thermometer-icon");

    if (celsiusTemp === null) {
        meterFill.style.width = "0%";
        meterFill.style.backgroundColor = "#94a3b8";
        meterStatus.textContent = "Neutral";
        thermIcon.className = "fa-solid fa-temperature-empty logo-icon";
        return;
    }

    // Map Celsius scale to a 0% - 100% width bound (Cold: -20°C or below, Hot: 50°C or above)
    let percentage = ((celsiusTemp + 20) / 70) * 100;
    percentage = Math.max(0, Math.min(100, percentage)); // Bind bounds

    meterFill.style.width = `${percentage}%`;

    if (celsiusTemp <= 5) {
        // Cold status
        meterFill.style.backgroundColor = "#3b82f6";
        meterStatus.textContent = "Freezing / Cold";
        meterStatus.style.color = "#3b82f6";
        thermIcon.className = "fa-solid fa-temperature-low logo-icon";
    } 
    else if (celsiusTemp > 5 && celsiusTemp <= 35) {
        // Moderate status
        meterFill.style.backgroundColor = "#f5b400";
        meterStatus.textContent = "Moderate / Warm";
        meterStatus.style.color = "#f5b400";
        thermIcon.className = "fa-solid fa-temperature-half logo-icon";
    } 
    else {
        // Hot status
        meterFill.style.backgroundColor = "#ef4444";
        meterStatus.textContent = "High Heat / Hot";
        meterStatus.style.color = "#ef4444";
        thermIcon.className = "fa-solid fa-temperature-high logo-icon";
    }
}

// Dynamic Swap feature
function swapUnits() {
    const unitSelect = document.getElementById("unit");
    const tempInput = document.getElementById("temperature");
    const currentValue = parseFloat(tempInput.value);

    const currentUnit = unitSelect.value;
    let nextUnit = "celsius";

    if (currentUnit === "celsius") {
        nextUnit = "fahrenheit";
    } else if (currentUnit === "fahrenheit") {
        nextUnit = "kelvin";
    } else if (currentUnit === "kelvin") {
        nextUnit = "celsius";
    }

    unitSelect.value = nextUnit;

    // Convert existing value on-the-fly when swapping units
    if (!isNaN(currentValue)) {
        if (currentUnit === "celsius" && nextUnit === "fahrenheit") {
            tempInput.value = ((currentValue * 9/5) + 32).toFixed(2);
        } else if (currentUnit === "fahrenheit" && nextUnit === "kelvin") {
            tempInput.value = (((currentValue - 32) * 5/9) + 273.15).toFixed(2);
        } else if (currentUnit === "kelvin" && nextUnit === "celsius") {
            tempInput.value = (currentValue - 273.15).toFixed(2);
        }
    }

    convertTemp();
}

// Preset Quick Button triggers
function applyPreset(value, unitType) {
    document.getElementById("temperature").value = value;
    document.getElementById("unit").value = unitType;
    convertTemp();
}

function resetOutputs() {
    document.getElementById("output-one").textContent = "--";
    document.getElementById("output-two").textContent = "--";
    document.getElementById("formula-display").textContent = "Input a value to show step-by-step math.";
}

function clearAll() {
    document.getElementById("temperature").value = "";
    document.getElementById("validation-warning").textContent = "";
    resetOutputs();
    updateLevelMeter(null);
}

// Clip copying structure
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
        console.error("Clipboard write error: ", err);
    });
}

// History collection logic
function updateHistory(inputVal, inputUnit, outOne, unitOneLabel, outTwo, unitTwoLabel) {
    const formattedUnit = inputUnit === "celsius" ? "°C" : inputUnit === "fahrenheit" ? "°F" : "K";
    const labelOneShort = unitOneLabel.includes("Celsius") ? "°C" : unitOneLabel.includes("Fahrenheit") ? "°F" : "K";
    const labelTwoShort = unitTwoLabel.includes("Celsius") ? "°C" : unitTwoLabel.includes("Fahrenheit") ? "°F" : "K";
    
    const entryText = `${inputVal}${formattedUnit} ➔ ${outOne.toFixed(1)}${labelOneShort} / ${outTwo.toFixed(1)}${labelTwoShort}`;
    
    // Check duplication threshold
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

// Toggle Dark Mode
function toggleMode() {
    const isDark = document.body.classList.toggle("dark");
    const themeBtn = document.getElementById("theme-toggle");

    if (isDark) {
        themeBtn.innerHTML = `<i class="fa-solid fa-sun" style="color: #f5b400;"></i> <span>Toggle Light Mode</span>`;
    } else {
        themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i> <span>Toggle Dark Mode</span>`;
    }
}
