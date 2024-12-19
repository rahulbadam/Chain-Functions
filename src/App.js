import React, { useState, useEffect, useCallback } from 'react'
import './App.css';
import MathFunction from './MathFunction';

function calculateWithX(x, equation) {

  function operate(a, b, operator) {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      case '^': return Math.pow(a, b);
      default: throw new Error("Invalid operator");
    }
  }

  function handleImplicitMultiplication(equation) {
    return equation
      .replace(/(\d)(x)/gi, '$1 * $2')
      .replace(/(\d)\(/g, '$1 * (')
      .replace(/(\))(\d)/g, '$1 * $2')
      .replace(/(x)(\d)/gi, '$1 * $2');
  }

  function substituteAndTokenize(equation) {
    const processedEquation = handleImplicitMultiplication(equation);
    const substituted = processedEquation.replace(/x/gi, `(${x})`);
    return substituted.match(/(\d+(\.\d+)?|\^|\*|\/|\+|-|\(|\))/g);
  }

  function evaluateExpression(tokens) {
    const operatorPrecedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    const output = [];
    const operators = [];

    for (let token of tokens) {
      if (!isNaN(token)) {
        output.push(parseFloat(token));
      } else if (token in operatorPrecedence) {
        while (
          operators.length &&
          operatorPrecedence[operators[operators.length - 1]] >= operatorPrecedence[token]
        ) {
          output.push(operators.pop());
        }
        operators.push(token);
      } else if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          output.push(operators.pop());
        }
        operators.pop();
      }
    }

    while (operators.length) {
      output.push(operators.pop());
    }

    return output;
  }

  function evaluatePostfix(postfixTokens) {
    const stack = [];
    for (let token of postfixTokens) {
      if (!isNaN(token)) {
        stack.push(token);
      } else {
        const b = stack.pop();
        const a = stack.pop();
        stack.push(operate(a, b, token));
      }
    }
    return stack[0];
  }

  try {
    const tokens = substituteAndTokenize(equation);
    if (!tokens) throw new Error("Invalid equation format");

    const postfix = evaluateExpression(tokens);
    return evaluatePostfix(postfix);
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

function App() {
  const [output, setOutput] = useState(_ => [])
  const [outputVal, setOutputVal] = useState(_ => "")
  useEffect(() => {
    if (Object.entries(output).length > 5) {
      let x = output[0];
      let arr = [1, 2, 4, 5, 3]
      for (let i = 0; i < 5; i++) {
        x = calculateWithX(x, output[arr[i]]);
      }
      setOutputVal(_ => x)
    }
  }, [output])

  function connectLine(fromId, toId, lineId) {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    const line = document.getElementById(lineId);

    if (!from || !to || !line) return;
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    const fromX = fromRect.left + fromRect.width / 2;
    const fromY = fromRect.top + fromRect.height / 2;
    const toX = toRect.left + toRect.width / 2;
    const toY = toRect.top + toRect.height / 2;

    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    line.style.width = distance + "px";
    line.style.transform = `rotate(${angle}deg)`;
    line.style.top = `${fromY}px`;
    line.style.left = `${fromX}px`;
  }

  const updateConnections = useCallback(() => {
    const connections = [
      { start: "function_0_output", end: "function_1_input", line: "line1" },
      { start: "function_1_output", end: "function_2_input", line: "line2" },
      { start: "function_2_output", end: "function_4_input", line: "line3" },
      { start: "function_4_output", end: "function_5_input", line: "line4" },
      { start: "function_5_output", end: "function_3_input", line: "line5" },
      { start: "function_3_output", end: "function_6_input", line: "line6" },
    ];

    connections.forEach(({ start, end, line }) => connectLine(start, end, line));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateConnections);
    document.querySelector('#mainDiv').addEventListener("scroll", updateConnections, false);

    updateConnections();
    return () => {
      window.removeEventListener("resize", updateConnections);
      window.removeEventListener("scroll", updateConnections);
    };
  }, [updateConnections]);

  return (
    <div id="mainDiv" className='overflow-auto flex m-[120px] no-scrollbar'>
      <div className='h-[450px] flex items-center justify-center'>
        <div>
          <div className='px-3 py-1 border border-[#E29A2D] bg-[#E29A2D] rounded-full w-fit text-[#FFFFFF] text-xs mb-2 font-semibold'>
            inital value of x
          </div>
          <div className='flex border-[2px] border-[#FFC267] w-[115px] px-1 rounded-lg'>
            <input
              className="px-2 py-1  w-[80px] h-[23px] focus:outline-none focus:none border-transparent"
              type="text" onChange={ev => setOutput((prev) => ({
                ...prev,
                0: ev.target.value,
              }))} />
            <div className='h-[23px] border-l border-[#FFEED5]'></div>
            <div className='p-1'>
              <div
                id={`function_0_output`}
                className="w-[15px] h-[15px] border-[3px] border-[#D3D3D3] rounded-full flex justify-center items-center">
                <div className="w-[5px] h-[5px] rounded-full bg-blue-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className='flex w-ful gap-20' >
          <MathFunction functionName="Function 1" setOutput={setOutput} nextFunction={2} index={1} />
          <div id="line1" className='fixed bg-[#0066FF4F] h-[5px] origin-top-left z-10 -mt-[2px]'></div>
          <MathFunction functionName="Function 2" setOutput={setOutput} nextFunction={4} index={2} />
          <div id="line2" className='fixed bg-[#0066FF4F] h-[5px] origin-top-left z-10 -mt-[2px]'></div>
          <MathFunction functionName="Function 3" setOutput={setOutput} nextFunction={6} index={3} />
          <div id="line3" className='fixed bg-[#0066FF4F] h-[5px] origin-top-left z-10 -mt-[2px]'></div>
        </div>

        <div className='flex w-ful gap-20 ml-[200px]'>
          <div id="line4" className='fixed bg-[#0066FF4F] h-[5px] origin-top-left z-10 -mt-[2px]'></div>
          <MathFunction functionName="Function 4" setOutput={setOutput} nextFunction={5} index={4} />
          <div id="line5" className='fixed bg-[#0066FF4F] h-[5px] origin-top-left z-10 -mt-[2px]'></div>
          <MathFunction functionName="Function 5" setOutput={setOutput} nextFunction={3} index={5} />
          <div id="line6" className='fixed bg-[#0066FF4F] h-[5px] origin-top-left z-10 -mt-[2px]'></div>
        </div>
      </div>
      <div className='h-[450px] flex items-center justify-center'>
        <div>
          <div className='px-3 py-1 border border-[#4CAF79] bg-[#4CAF79] rounded-full w-fit text-[#FFFFFF] text-xs mb-2 font-semibold'>
            Final output y
          </div>
          <div className='flex border-[2px] border-[#2DD179] w-[115px] px-1 rounded-lg'>
            <div className='p-1'>

              <div
                id={`function_6_input`}
                className="w-[15px] h-[15px] border-[3px] border-[#D3D3D3] rounded-full flex justify-center items-center">
                <div className="w-[5px] h-[5px] rounded-full bg-blue-600"></div>
              </div>
            </div>
            <div className='h-[23px] border-l border-[#FFEED5]'></div>


            <input
              className="px-2 py-1 w-[80px] h-[23px] focus:outline-none focus:none border-transparent"
              type="text"
              value={outputVal}
              readOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
