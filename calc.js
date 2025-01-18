// DOM Selectors
const display = document.querySelector(".display");
const operands = document.querySelectorAll(".operand");
const clear = document.querySelector(".clear");
const sign = document.querySelector(".sign");
const dot = document.querySelector(".dot");
const percent = document.querySelector(".percent");
const operators = document.querySelectorAll(".operator");
const equal = document.querySelector(".equal");

// Constants
const MAX_DIGITS = 10;
const STYLES = {
  ERROR: { COLOR: "red", FONT_SIZE: "50px" },
  DEFAULT: { COLOR: "black", FONT_SIZE: "5em" },
};

// State management
let state = {
  operatorClicked: false,
  hasFirstOperand: false,
  shouldResetDisplay: false,
  firstOperand: null,
  secondOperand: null,
  currentOperator: null,
};

// Display functions
function showError(message, fontSize = STYLES.ERROR.FONT_SIZE) {
  display.textContent = message;
  display.style.fontSize = fontSize;
  display.style.color = STYLES.ERROR.COLOR;
}

function resetDisplay() {
  display.textContent = "0";
  display.style.fontSize = STYLES.DEFAULT.FONT_SIZE;
  display.style.color = STYLES.DEFAULT.COLOR;
}

function setDisplayValue(value) {
  if (display.textContent === "0") {
    display.textContent = "";
  }

  if (value.includes("Cannot divide by zero")) {
    showError("Cannot divide by zero", "40px");
    return;
  }

  if (display.textContent.length <= MAX_DIGITS) {
    display.textContent += value;
  } else {
    showError("Only 10 digits allowed");
  }
}

function getCurrentValue() {
  return parseFloat(display.textContent);
}

// Calculator operations
const operations = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => (b === 0 ? "Cannot divide by zero" : a / b),
};

function calculate() {
  const { firstOperand, secondOperand, currentOperator } = state;

  if (firstOperand === null || currentOperator === null) {
    return display.textContent;
  }

  const result = operations[currentOperator]?.(firstOperand, secondOperand);
  return result !== undefined ? result : display.textContent;
}

// Event handlers
function handlePercent() {
  const currentValue = getCurrentValue();
  if (!isNaN(currentValue)) {
    display.textContent = (currentValue / 100).toString();
  }
}

function handleOperand(event) {
  state.hasFirstOperand = true;
  if (state.operatorClicked) {
    display.textContent = "";
    state.operatorClicked = false;
    removeActiveOperator();
  }
  setDisplayValue(event.target.textContent);
}

function handleOperator(event) {
  state.currentOperator = event.target.textContent;
  state.operatorClicked = true;

  if (state.firstOperand === null) {
    state.firstOperand = getCurrentValue();
  } else {
    state.secondOperand = getCurrentValue();
  }

  if (state.firstOperand !== null && state.secondOperand !== null) {
    processCalculation();
  }
  removeActiveOperator();
  if (state.hasFirstOperand) {
    event.target.classList.add("active-operator");
  }
}

function handleEqual() {
  if (state.firstOperand !== null) {
    state.secondOperand = getCurrentValue();
  }
  if (state.firstOperand !== null && state.secondOperand !== null) {
    processCalculation();
    removeActiveOperator();
  }
}

function processCalculation() {
  const result = calculate();
  display.textContent = "";

  if (result === "Cannot divide by zero") {
    resetCalculator();
    setDisplayValue(result);
  } else {
    state.firstOperand = result;
    state.secondOperand = null;
    display.textContent = formatResult(result);
  }
}

function formatResult(number) {
  // Handle decimal places to avoid long floating point numbers
  return number;
  //Number.isInteger(number) ? number.toString() : number.toFixed(8).replace(/\.?0+$/, '');
}

function toggleSign() {
  const currentValue = getCurrentValue();
  display.textContent = (currentValue * -1).toString();
}

function setDecimal() {
  if (!display.textContent.includes(".")) {
    display.textContent += ".";
  }
}

function removeActiveOperator() {
  operators.forEach((operator) => operator.classList.remove("active-operator"));
}

function resetCalculator() {
  state = {
    operatorClicked: false,
    hasFirstOperand: false,
    shouldResetDisplay: false,
    firstOperand: null,
    secondOperand: null,
    currentOperator: null,
  };
  removeActiveOperator();
}

// Event listeners
percent.addEventListener("click", handlePercent);
operands.forEach((operand) => operand.addEventListener("click", handleOperand));
clear.addEventListener("click", () => {
  resetDisplay();
  resetCalculator();
});
sign.addEventListener("click", toggleSign);
dot.addEventListener("click", setDecimal);
operators.forEach((operator) =>
  operator.addEventListener("click", handleOperator)
);
equal.addEventListener("click", handleEqual);
