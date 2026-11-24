const display = document.getElementById("display");
const keys = document.querySelector(".keys");

let expression = "";

function updateDisplay() {
  display.value = expression || "0";
}

function calculate() {
  if (!expression) return;

  // Allow only calculator characters before evaluating the expression.
  if (!/^[0-9+*/%.\-() ]+$/.test(expression)) {
    display.value = "Error";
    expression = "";
    return;
  }

  try {
    const result = Function('"use strict"; return (' + expression + ')')();
    if (!Number.isFinite(result)) throw new Error("Invalid calculation");
    expression = String(Number(result.toFixed(10)));
    updateDisplay();
  } catch {
    display.value = "Error";
    expression = "";
  }
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === "clear") {
    expression = "";
    updateDisplay();
    return;
  }

  if (action === "delete") {
    expression = expression.slice(0, -1);
    updateDisplay();
    return;
  }

  if (action === "calculate") {
    calculate();
    return;
  }

  if (value !== undefined) {
    // Prevent two decimal points in the same number.
    if (value === ".") {
      const currentNumber = expression.split(/[+*/%\-]/).pop();
      if (currentNumber.includes(".")) return;
    }
    expression += value;
    updateDisplay();
  }
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9.+*/%\-]$/.test(event.key)) {
    expression += event.key;
    updateDisplay();
  } else if (event.key === "Enter" || event.key === "=") {
    calculate();
  } else if (event.key === "Backspace") {
    expression = expression.slice(0, -1);
    updateDisplay();
  } else if (event.key === "Escape") {
    expression = "";
    updateDisplay();
  }
});
