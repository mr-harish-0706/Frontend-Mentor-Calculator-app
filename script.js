// Theme Switching
const themeToggle = document.getElementById("theme-toggle");
const calculator = document.querySelector(".calculator");
let currentTheme = 1;

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === 3 ? 1 : currentTheme + 1;
  document.body.setAttribute("data-theme", currentTheme);
  themeToggle.setAttribute("data-theme", currentTheme);
});

// Calculator Logic
const display = document.getElementById("display");
const buttons = document.querySelectorAll(
  ".buttons:not(.reset):not(.delete):not(.equal)",
);
const resetButton = document.getElementById("reset");
const deleteButton = document.getElementById("delete");
const equalsButton = document.getElementById("equals");

let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldResetScreen = false;

function updateDisplay() {
  // Format number with commas
  const parts = currentInput.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  display.value = parts.join(".");
}

// Initialize display
updateDisplay();

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.getAttribute("data-key");

    if (["+", "-", "*", "/"].includes(key)) {
      handleOperator(key);
      return;
    }

    if (shouldResetScreen) {
      currentInput = "";
      shouldResetScreen = false;
    }

    if (key === "." && currentInput.includes(".")) return;

    if (currentInput === "0" && key !== ".") {
      currentInput = key;
    } else {
      currentInput += key;
    }
    updateDisplay();
  });
});

function handleOperator(nextOperator) {
  const value = parseFloat(currentInput.replace(/,/g, ""));

  if (operator && shouldResetScreen) {
    operator = nextOperator;
    return;
  }

  if (previousInput === "") {
    previousInput = value;
  } else if (operator) {
    const result = calculate(previousInput, value, operator);
    currentInput = String(result);
    previousInput = result;
    updateDisplay();
  }

  shouldResetScreen = true;
  operator = nextOperator;
}

function calculate(first, second, op) {
  if (op === "+") return first + second;
  if (op === "-") return first - second;
  if (op === "*") return first * second;
  if (op === "/") return second === 0 ? "Error" : first / second;
  return second;
}

equalsButton.addEventListener("click", () => {
  if (!operator || shouldResetScreen) return;
  const value = parseFloat(currentInput.replace(/,/g, ""));
  const result = calculate(previousInput, value, operator);
  currentInput = String(result);
  operator = null;
  previousInput = "";
  shouldResetScreen = true;
  updateDisplay();
});

resetButton.addEventListener("click", () => {
  currentInput = "0";
  previousInput = "";
  operator = null;
  shouldResetScreen = false;
  updateDisplay();
});

deleteButton.addEventListener("click", () => {
  if (shouldResetScreen) return;
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = "0";
  }
  updateDisplay();
});
