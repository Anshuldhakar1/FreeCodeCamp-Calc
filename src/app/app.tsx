// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import styles from './app.module.css';

export const App:React.FC = () => {

	// interface opr {
	// 	id: string,
	// 	symbol: string,
	// 	operate: (a: number, b: number) => number | undefined,
	// 	priority: number
	// };
	
	interface numbers { 
		id: string,
		display: string,
		value: number
	};


	// const operations:Array<opr> = [
	// 	{
	// 		id: "add", symbol: "+", priority: 1,
	// 		operate: (a: number, b: number): number => {
	// 			return a + b;
	// 		}
	// 	},
	// 	{
	// 		id: "subtract", symbol: "-", priority: 1,
	// 		operate: (a: number, b: number): number => {
	// 			return a - b;
	// 		}
	// 	},
	// 	{
	// 		id: "multiply", symbol: "*", priority: 2,
	// 		operate: (a: number, b: number): number => {
	// 			return a * b;
	// 		}
	// 	},
	// 	{
	// 		id: "divide", symbol: "/", priority: 2,
	// 		operate: (a: number, b: number): number | undefined => {
	// 			return b !== 0 ? a / b : undefined;
	// 		}
	// 	},
	// ];

	const nums:Array<numbers> = [
		{ id: "seven", display: "7", value:7 },
		{ id: "eight", display: "8", value:8 },
		{ id: "nine", display: "9", value:9 },
		{ id: "four", display: "4", value:4 },
		{ id: "five", display: "5", value:5 },
		{ id: "six", display: "6", value:6 },
		{ id: "one", display: "1", value:1 },
		{ id: "two", display: "2", value:2 },
		{ id: "three", display: "3", value:3 },
		{ id: "zero", display: "0", value:0 },
	];

	interface Opr {
		id: string;
		symbol: string;
		operate: (a: number, b: number) => number;
		priority: number;
	};

	const operations: { [symbol: string]: Opr } = {
		"+": {
			id: "add",
			symbol: "+",
			operate: (a: number, b: number): number => {
				return a + b;
			},
			priority: 1,
		},
		"-": {
			id: "subtract",
			symbol: "-",
			operate: (a: number, b: number): number => {
				return a - b;
			},
			priority: 1,
		},
		"*": {
			id: "multiply",
			symbol: "*",
			operate: (a: number, b: number): number => {
				return a * b;
			},
			priority: 2,
		},
		"/": {
			id: "divide",
			symbol: "/",
			operate: (a: number, b: number): number => {
				return b !== 0 ? a / b : NaN;
			},
			priority: 2,
		},
	};


	const [expression, setExpression] = useState("0");
	const [inpNum, setinpNum] = useState("0");
	const [decimalInput, setDecimalInp] = useState(false);

	const handleNumClick = (val: string) => {
		setinpNum( inpNum!=="0"? inpNum+val:val );
	}

	const handleOpClick = (symbol: string) => {
		setDecimalInp(false);
		setExpression( expression!=="0"? expression + inpNum + symbol: inpNum + symbol );
		setinpNum("0");
	}

	const clearInput = () => {
		setDecimalInp(false);
		setExpression("0");
		setinpNum("0");
	};
	
	const handleDecimalClick = () => { 
		if (decimalInput) return null;
		setDecimalInp(true);
		setinpNum(inpNum + ".");
	};

	const evaluate = () => {
		try {
			const result = evaluateInfix( expression+inpNum );
			setExpression(expression + inpNum);
			setinpNum(result.toString());
		} catch (error) {
			console.error(error);
		}
	}

	function evaluateInfix(input: string): number {
		const numStack: number[] = [];
		const opStack: Opr[] = [];

		const tokens = input.match(/(\d+\.\d+|\d+|\+|-|\*|\/)/g);
		console.log(tokens);

		if (tokens) {
			for (const token of tokens) {
				if (!isNaN(Number(token))) {
					numStack.push(Number(token));
				} else if (operations[token]) {
					while (opStack.length > 0 && operations[token].priority <= opStack[opStack.length - 1].priority) {
						const op = opStack.pop();
						if (op) {
							const b = numStack.pop();
							const a = numStack.pop();
							if (a !== undefined && b !== undefined) {
								numStack.push(op.operate(a, b));
							} else {
								throw new Error(`Undefined values-(FL) : ${a} and ${b}`);
							}
						}
					}
					opStack.push(operations[token]);
				} else {
					throw new Error(`Invalid operation: ${token}`);
				}
			}

			while (opStack.length > 0) {
				const op = opStack.pop();
				if (op) {
					const b = numStack.pop();
					const a = numStack.pop();
					if (a !== undefined && b !== undefined) {
						numStack.push(op.operate(a, b));
					} else {
						throw new Error(`Undefined values-(WL): ${a} and ${b}`);
					}
				}
			}
		}

		return numStack[0];
	}


	return (
		<div style={{margin:"5rem"} }>
			<div className={styles.display}>
				<label className={ styles.expression }>{ expression}</label>
				<label id="display" className={ styles.inpNum }>{inpNum}</label>
			</div>
			<button id="clear" onClick={clearInput}>AC</button>
			<div>
				{Object.values(operations).map(op => { 
					return <button key={op.id} id={op.id} onClick={() => { handleOpClick(op.symbol); }}>{ op.symbol}</button>
				})}
			</div>
			<div id="numpad">
				{nums.map(num => { 
					return <button key={num.id} onClick={() => { handleNumClick(num.display); }} id={num.id}>{num.display}</button>
				}) }
			</div>
			<button id="decimal" onClick={() => { handleDecimalClick(); }}>.</button>
			<button id="equals" onClick={() => { evaluate(); }} >=</button>
			{/* <button id="equals">=</button> */}
		</div>
	);
}

export default App;
