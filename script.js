document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const buttons = document.querySelectorAll('button');
    
    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let resetScreen = false;

    // Update display
    function updateDisplay() {
        currentOperandElement.textContent = currentOperand;
        if (operation != null) {
            previousOperandElement.textContent = `${previousOperand} ${operation}`;
        } else {
            previousOperandElement.textContent = previousOperand;
        }
    }

    // Append number
    function appendNumber(number) {
        if (currentOperand === '0' || resetScreen) {
            currentOperand = '';
            resetScreen = false;
        }
        if (number === '.' && currentOperand.includes('.')) return;
        currentOperand += number;
    }

    // Choose operation
    function chooseOperation(op) {
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            compute();
        }
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
        resetScreen = true;
    }

    // Compute
    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }
        
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        resetScreen = true;
    }

    // Clear
    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }

    // Delete
    function deleteNumber() {
        if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }

    // Format number with commas
    function formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Button click handler
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.hasAttribute('data-number')) {
                appendNumber(button.textContent);
                updateDisplay();
            } else if (button.hasAttribute('data-action')) {
                const action = button.getAttribute('data-action');
                if (action === 'clear') {
                    clear();
                } else if (action === 'delete') {
                    deleteNumber();
                } else if (action === 'equals') {
                    compute();
                } else {
                    chooseOperation(action);
                }
                updateDisplay();
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            appendNumber(e.key);
            updateDisplay();
        } else if (e.key === '.') {
            appendNumber('.');
            updateDisplay();
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            let op = e.key;
            if (op === '*') op = '×';
            if (op === '/') op = '÷';
            chooseOperation(op);
            updateDisplay();
        } else if (e.key === 'Enter' || e.key === '=') {
            compute();
            updateDisplay();
        } else if (e.key === 'Escape') {
            clear();
            updateDisplay();
        } else if (e.key === 'Backspace') {
            deleteNumber();
            updateDisplay();
        }
    });

    // Initialize display
    updateDisplay();
});