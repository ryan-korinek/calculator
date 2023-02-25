'use-strict';

const keys = document.querySelectorAll('.key');
const screen = document.querySelector('.screen');
const screenTop = document.querySelector('.screen-top');
const screenBottom = document.querySelector('.screen-bottom');

let lastOperandText;
let lastOperand;
let lastClassSelection;
let lastTextSelection = false;
let lastBasicOperand;
let previousNumber = false;
let percentNumber;
let total = false;
let numbers = [];

function add(num) {
  total += num;
  return total;
}

function subtract(num) {
  total -= num;
  return total;
}

function multiply(num) {
  console.log(num);
  total *= num;
  return total;
}

function divide(num) {
  total /= num;
  return total;
}

function squareRoot(num) {
  return Math.sqrt(num);
}

function squared(num1) {
  return num1 * num1;
}

function percent(num1, num2) {
  return num1 * (num2 / 100);
}

function displayKey(event) {
  const textSelection = event.target.textContent;
  const classSelection = event.target.classList[1];
  const operand = event.target.classList[2];
  let currentNum = Number(event.target.textContent);

  ///////////////////////////////////////////////////////////////////////
  // Operations independent of the beginning state and running total state
  ///////////////////////////////////////////////////////////////////////

  // Clearing the calculator completely

  if (textSelection === 'C') {
    screenTop.innerText = '';
    screenBottom.innerText = 0;
    lastTextSelection = '';
    lastOperand = '';
    lastClassSelection = '';
    total = false;
  }

  // Clearing the current entry
  if (textSelection === 'CE') {
    screenBottom.innerText = 0;
  }

  // Decimal functionality
  if (classSelection === 'decimal') {
    // Only one decimal allowed
    if (screenBottom.innerText.includes('.')) return;
    // If current operation is an operand
    else if (operand === 'operand-basic') {
      console.log(operand);
      screenBottom.innerText = `0.`;
    } else {
      screenBottom.innerText += textSelection;
    }
  }

  // Delete functionality
  if (classSelection === 'delete') {
    if (screenBottom.innerText.length === 1) {
      screenBottom.innerText = 0;
    } else if (
      lastOperand === 'operand-basic' ||
      lastOperand === 'operand-advanced'
    ) {
      return;
    } else {
      screenBottom.innerText = screenBottom.innerText.slice(0, -1);
    }
  }

  ///////////////////////////////////////////////////////////////////////
  // If there is no total (at the beginning or after a clear)
  ///////////////////////////////////////////////////////////////////////

  if (total === false) {
    // If one of the number keys is pressed with no running total
    if (operand === 'number') {
      if (screenBottom.innerText === '0') {
        screenBottom.innerText = +textSelection;
      } else {
        screenBottom.innerText += +textSelection;
      }

      // If one of the basic operands is pressed (add, subtract, divide, multiply)
    } else if (operand === 'operand-basic') {
      total = +screenBottom.innerText;

      screenTop.innerText = `${total} ${textSelection}`;
    }
  }

  ///////////////////////////////////////////////////////////////////////
  // If there is a running total
  ///////////////////////////////////////////////////////////////////////

  // If one of the number keys is pressed with a running total
  else if (total !== false) {
    if (operand === 'number') {
      if (lastOperand === 'number' || lastClassSelection === 'decimal') {
        screenBottom.innerText += currentNum;
      } else {
        screenBottom.innerText = currentNum;
      }
    }

    // Basic operands must be followed by a number. Cannot repeatedly press a basic-operand key. However, it will change the symbol on the screen.
    else if (operand === 'operand-basic' && lastOperand === 'operand-basic') {
      screenTop.innerText = `${total} ${textSelection}`;
    }

    // If one of the basic operands is pressed (add, subtract, divide, multiply) with a running total
    // Executes the previously stored basic operand
    else if (operand === 'operand-basic') {
      if (lastBasicOperand === 'add') {
        add(+screenBottom.innerText);
      } else if (lastBasicOperand === 'subtract') {
        subtract(+screenBottom.innerText);
      } else if (lastBasicOperand === 'multiply') {
        multiply(+screenBottom.innerText);
      } else if (lastBasicOperand === 'divide') {
        divide(+screenBottom.innerText);
      }
      // If '=' is pressed, then display 'num + num = ' otherwise display only one number
      if (textSelection === '=') {
        screenTop.innerText += ` ${screenBottom.innerText} ${textSelection}`;
        screenBottom.innerText = total;
      } else {
        screenBottom.innerText = total;
        screenTop.innerText = `${total} ${textSelection}`;
      }
    }
  }
  lastTextSelection = textSelection;
  lastOperand = operand;
  lastClassSelection = classSelection;
  previousNumber = Number(screenBottom.innerText);

  // Stores which operand was pressed
  if (operand === 'operand-basic') {
    lastBasicOperand = classSelection;
  }
}

keys.forEach(key => key.addEventListener('click', displayKey));
