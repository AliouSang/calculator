const display = document.querySelector(".display");
const buttons = document.querySelector(".buttons");

let firstNumber = null;
let operator = null;
let secondNumber = null;
let waitingForSecondNumber = false;
let justCalculated = false;


function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  if (b === 0) {
    return undefined;
  }
  return a / b;
}


function operate(operator, a, b) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "x":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return null;
  }
}


function roundResult(number) {
  const factor = 10 ** 8;
  return Math.round(number * factor) / factor;
}
function updateDisplay(value) {
  display.textContent = value;
}


function calculate() {
  if (
    firstNumber === null ||
    operator === null ||
    secondNumber === null
  ) {
    return null;
  }
  const a = Number(firstNumber);
  const b = Number(secondNumber);
  const result = operate(operator, a, b);
  if (result === null) {
    return null;
  } else if (result === undefined) {
    return undefined;
  }
  return roundResult(result);
}


function inputDigit(digit) {
  if (justCalculated) {
    firstNumber = null;
    operator = null;
    secondNumber = null;
    justCalculated = false;
  }
  if (waitingForSecondNumber) {
    secondNumber = digit;
    waitingForSecondNumber = false;
  } else if (operator === null) {
    if (firstNumber === null || firstNumber === "0") {
      firstNumber = digit;
    } else {
      firstNumber += digit;
    }
  } else {
    if (secondNumber === null || secondNumber === "0") {
      secondNumber = digit;
    } else {
      secondNumber += digit;
    }
  }
  updateDisplay(
    secondNumber !== null ? secondNumber : firstNumber
  );
}


function inputOperator(nextOperator) {
  if (firstNumber === null) {
    return;
  }
  if (operator !== null && secondNumber !== null) {
    const result = calculate();
    if (result === undefined) {
      showError("ERROR");
      return;
    }
    firstNumber = result.toString();
    secondNumber = null;
    updateDisplay(firstNumber);
  }
  operator = nextOperator;
  waitingForSecondNumber = true;
  justCalculated = false;
}


function inputDecimal() {
  if (justCalculated) {
    firstNumber = "0.";
    operator = null;
    secondNumber = null;
    justCalculated = false;
    updateDisplay(firstNumber);
    return;
  }
  if (waitingForSecondNumber) {
    secondNumber = "0.";
    waitingForSecondNumber = false;
    updateDisplay(secondNumber);
    return;
  }
  if (operator === null) {
    if (firstNumber === null) {
      firstNumber = "0.";
    } else if (!firstNumber.includes(".")) {
      firstNumber += ".";
    }
    updateDisplay(firstNumber);
  } else {
    if (secondNumber === null) {
      secondNumber = "0."
    } else if (!secondNumber.includes(".")) {
      secondNumber += ".";
    }
    updateDisplay(secondNumber);
  }
}


function inputEquals() {
  const result = calculate();
  if (result === undefined) {
    showError("ERROR");
    return;
  } 
  updateDisplay(result);
  firstNumber = result.toString();
  operator = null;
  secondNumber = null;
  justCalculated = true;
  waitingForSecondNumber = false;
}


function deleteLastDigit() {
  if (justCalculated) {
    return;
  }
  if (secondNumber !== null) {
    secondNumber = secondNumber.slice(0, -1);
    if (secondNumber === "") {
      secondNumber = null;
    }
    updateDisplay(secondNumber ?? firstNumber);
    return;
  }
  if (operator !== null) {
    operator = null;
    waitingForSecondNumber = false;
    updateDisplay(firstNumber);
    return;
  }
  if (firstNumber !== null) {
    firstNumber = firstNumber.slice(0, -1);
    if (firstNumber === "") {
      firstNumber = null;
    }
    updateDisplay(firstNumber ?? "0");
  }
}

function clearCalculator() {
  firstNumber = null;
  operator = null;
  secondNumber = null;
  waitingForSecondNumber = false;
  justCalculated = false;
  updateDisplay("0");
}


function showError(message) {
  updateDisplay(message);
  firstNumber = null;
  operator = null;
  secondNumber = null;
  waitingForSecondNumber = false;
  justCalculated = true;
}


buttons.addEventListener("click", (event) => {
  const button = event.target;
  if (button.tagName !== "BUTTON") {
    return;
  }
  const value = button.textContent;
  if (button.classList.contains("clear")) {
    clearCalculator();
  } else if (button.classList.contains("delete")) {
    deleteLastDigit();
  } else if (button.classList.contains("decimal")) {
    inputDecimal();
  } else if (button.classList.contains("btn--operator")) {
    if (value === "=") {
      inputEquals();
    } else {
      inputOperator(value);
    }
  } else {
    inputDigit(value);
  }
});

document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (["/", "Enter"].includes(key)) {
    event.preventDefault();
  }

  if (key >= "0" && key <= "9") {
    inputDigit(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (["+", "-", "*", "/"].includes(key)) {
    const operatorKey = (key === "*") ? "x" : key;
    inputOperator(operatorKey);
  } else if (key === "Enter" || key === "=") {
    inputEquals();
  } else if (key === "Backspace") {
    deleteLastDigit();
  } else if (key === "Escape") {
    clearCalculator();
  }
});
