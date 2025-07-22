const inputBox = document.getElementById("inputBox");
const buttons = document.querySelectorAll(".button-grid button");
const deleteBtn = document.getElementById("backspaceBtn");

// Utility buttons
const sqrtBtn = document.getElementById("sqrtBtn");
const unitConvertBtn = document.getElementById("unitConvertBtn");
const historyBtn = document.getElementById("historyBtn");

let expression = "";

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.innerText;

    if (value === "C") {
      expression = "";
    } else if (value === "=") {
      try {
        expression = eval(expression.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-"));
      } catch {
        expression = "Error";
      }
    } else if (value === "+/-") {
      expression = String(-1 * parseFloat(expression));
    } else if (value === "( )") {
      expression += expression.includes("(") && !expression.includes(")") ? ")" : "(";
    } else {
      expression += value;
    }

    inputBox.value = expression;
  });
});

//  Backspace
deleteBtn.addEventListener("click", () => {
  expression = expression.slice(0, -1);
  inputBox.value = expression;
});

// √ Square root
sqrtBtn.addEventListener("click", () => {
  try {
    expression = Math.sqrt(eval(expression)).toString();
    inputBox.value = expression;
  } catch {
    inputBox.value = "Error";
    expression = "";
  }
});

//  History (for now, just alert a dummy message)
historyBtn.addEventListener("click", () => {
  alert("History feature coming soon!");
});

//  Unit Converter (for now, alert)
unitConvertBtn.addEventListener("click", () => {
  alert("Unit converter feature coming soon!");
});
