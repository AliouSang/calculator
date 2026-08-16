const add = (a, b) => a + b;

const subtract = (a, b) => a - b;

const multiply = (a, b) => a * b;

const divide = (a, b) => a / b;

let num1, op, num2;

const operate = (op, num1, num2) => {
  let result;
  if (op === "+") {
    result = add(num1, num2)  
  } else if(op === "-") {
    result = subtract(num1, num2);
  } else if (op === "*") {
    result = multiply(num1, num2);
  } else if (op === "/") {
    result = divide(num1, num2);
  }
  return result;
}