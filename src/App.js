import React, { useState, useEffect, useCallback, useContext } from 'react';
import './App.css';

const CalculatorContext = React.createContext();

function Calculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [value, setValue] = useState(null);


  const compute = useCallback((leftOperand, rightOperand, operator) => {
    let result;

    switch (operator) {
      case '+':
        result = leftOperand + rightOperand;
        break;
      case '-':
        result = leftOperand - rightOperand;
        break;
      case '*':
        result = leftOperand * rightOperand;
        break;
      case '/':
        result = leftOperand / rightOperand;
        break;
      default:
        result = rightOperand;
    }

    return result;
  },[])

  const handleClear = useCallback(() => {
    setDisplayValue('0');
    setOperator(null);
    setWaitingForOperand(false);
    setValue(null);
  }, []);

  const handleEquals = useCallback(() => {
    let result;

    if (value == null) {
      result = parseFloat(displayValue);
    } else if (operator) {
      result = compute(value, parseFloat(displayValue), operator);
    }

    setDisplayValue(String(result));
    setOperator(null);
    setValue(null);
    setWaitingForOperand(true);
  }, [displayValue, operator, value, compute]);

  const inputDigit = useCallback((digit) => {
    const newDisplayValue = waitingForOperand ? String(digit) : displayValue + digit;
    setDisplayValue(newDisplayValue);
    setWaitingForOperand(false);
  },[displayValue, waitingForOperand])

  const inputDot = useCallback(() => {
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
    } else if (displayValue.indexOf('.') === -1) {
      setDisplayValue(displayValue + '.');
    }
  },[displayValue, setDisplayValue, waitingForOperand])

  const handleOperator = useCallback((nextOperator) => {
    const nextValue = parseFloat(displayValue);

    if (value == null) {
      setValue(nextValue);
    } else if (operator) {
      const currentValue = value || 0;
      const computedValue = compute(currentValue, nextValue, operator);

      setValue(computedValue);
      setDisplayValue(String(computedValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  },[compute, displayValue, operator, value])

  const toggleSign = useCallback(() => {
    const newValue = parseFloat(displayValue) * -1
    setDisplayValue(newValue)
  },[displayValue])

  const inputPercent = useCallback(() => {
    const currentValue = parseFloat(displayValue)
    
    if (currentValue === 0)
      return
    
    const fixedDigits = displayValue.replace(/^-?\d*\.?/, '')
    const newValue = parseFloat(displayValue) / 100

    setDisplayValue(String(newValue.toFixed(fixedDigits.length + 2)))

  },[displayValue])

  const clearLastChar = useCallback(() => {    
    setDisplayValue(displayValue.substring(0, displayValue.length - 1) || '0')
  },[displayValue])

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      const { key } = event;
      if (key === 'Backspace') {
        event.preventDefault();
        clearLastChar();
      } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
        event.preventDefault();
        handleOperator(key);
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleEquals();
      } else if (key >= '0' && key <= '9') {
        event.preventDefault();
        inputDigit(parseInt(event.key, 10));
      } else if (key === '.') {
        event.preventDefault();
        inputDot();
      }
    });
  }, [clearLastChar, handleEquals, handleOperator, inputDigit, inputDot]);



  return (
    <CalculatorContext.Provider value={{ displayValue, inputDigit, inputDot, handleOperator, handleClear, handleEquals, toggleSign, inputPercent, clearLastChar }}>
      <div className="calculator">
        <CalculatorDisplay />
        <CalculatorKeypad />
      </div>
    </CalculatorContext.Provider>
  );
  }

  
function CalculatorDisplay() {
  const { displayValue } = useContext(CalculatorContext);
  return (
    <div className="display">{parseInt(displayValue,10)}</div>
  );
}

  function CalculatorKeypad() {
    const { inputDigit, inputDot, handleOperator, handleClear, handleEquals, toggleSign, inputPercent, displayValue } = useContext(CalculatorContext);
    const clearText = displayValue !== '0' ? 'C' : 'AC'

    return (
      <div className="keypad">
        <button className="keypad-clear" onClick={handleClear}>{clearText}</button>
        <button className="keypad-sign" onClick={() => toggleSign()}>±</button>
        <button className="keypad-percent" onClick={() => inputPercent()}>%</button>
        <button className="keypad-operator" onClick={() => handleOperator('/')}>÷</button>
        <button className="keypad-digit" onClick={() => inputDigit(7)}>7</button>
        <button className="keypad-digit" onClick={() => inputDigit(8)}>8</button>
        <button className="keypad-digit" onClick={() => inputDigit(9)}>9</button>
        <button className="keypad-operator" onClick={() => handleOperator('*')}>×</button>
        <button className="keypad-digit" onClick={() => inputDigit(4)}>4</button>
        <button className="keypad-digit" onClick={() => inputDigit(5)}>5</button>
        <button className="keypad-digit" onClick={() => inputDigit(6)}>6</button>
        <button className="keypad-operator" onClick={() => handleOperator('-')}>−</button>
        <button className="keypad-digit" onClick={() => inputDigit(1)}>1</button>
        <button className="keypad-digit" onClick={() => inputDigit(2)}>2</button>
        <button className="keypad-digit" onClick={() => inputDigit(3)}>3</button>
        <button className="keypad-operator" onClick={() => handleOperator('+')}>+</button>
        <button className="keypad-zero" onClick={() => inputDigit(0)}>0</button>
        <button className="keypad-dot" onClick={inputDot}>●</button>
        <button className="keypad-equal" onClick={handleEquals}>=</button>
      </div>
    );
  }

   export default Calculator;