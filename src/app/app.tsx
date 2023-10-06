// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import styles from './app.module.css';

export const App:React.FC = () => {

	interface opr {
		id: string,
		symbol: string,
		operate: (a: number, b: number) => number | undefined,
		priority: number
	};
	
	interface numbers { 
		id: string,
		display: string,
		value: number
	};


	const operations:Array<opr> = [
		{
			id: "add", symbol: "+", priority: 1,
			operate: (a: number, b: number): number => {
				return a + b;
			}
		},
		{
			id: "subtract", symbol: "-", priority: 1,
			operate: (a: number, b: number): number => {
				return a - b;
			}
		},
		{
			id: "multiply", symbol: "*", priority: 2,
			operate: (a: number, b: number): number => {
				return a * b;
			}
		},
		{
			id: "divide", symbol: "/", priority: 2,
			operate: (a: number, b: number): number | undefined => {
				return b !== 0 ? a / b : undefined;
			}
		},
	];

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

		// const inp = expression + inpNum;

		// console.log(inp);
		// input += "s";

		// const input = "12.45+2.0*4-3/10";
		// const input = "14*7-225/5";
		const input = "123-4";
		console.log(input);
		
		const inpStack = [];

		let n = "";
		let decimal = false;
		for(let i = 0; i < input.length; i++) {
			if ("0123456789.".includes(input[i])) {
				n += input[i];
				if (input[i] === '.') decimal = true;
			} else {
				inpStack.push( decimal? parseFloat(n) :parseInt(n) );
				inpStack.push(input[i]);
				n = "";
				decimal = false;
			} 	
		}
		inpStack.push(decimal ? parseFloat(n) : parseInt(n));
		console.log(inpStack);

		const evalStack:number[] = [];
		const oprStack = [];
		const inp = [...inpStack];

		const inplen = inpStack.length;

		for (let i = 0; i < inplen; i++) {
			const token = inp[i];
			console.log("token: " + token);
			if (typeof (token) != "string") {
				console.log("token: "+token+" is not type string");
				evalStack.push(token);
				console.log("num stack after addition: ", evalStack);
			} else {
				console.log("token " + token + " is type string");
				
				const operator = operations.find((opr) => opr.symbol === token);
				if (!operator) {
					console.log("token: " + token + "is not found in the operators");
					break;
				}

				console.log("token opeartion: " + operator.id);
				
				if (operator.priority < oprStack[oprStack.length - 1]?.priority) {
					console.log("token: " + token + " has lower priority than " + oprStack[oprStack.length - 1].symbol);

					console.log("num stack before popping elements: ", evalStack);

					const curr_operator = oprStack.shift();
					if (!curr_operator) {
						console.log("curr_operator is not valid");
						break;
					}

					const a = evalStack.shift();
					const b = evalStack.shift();

					console.log("Numbers popped out: " + a + " " + b);

					const res = curr_operator.operate(a, b);
					console.log("Operation " + curr_operator.symbol + " result: " + res);

					evalStack.unshift(res);
					console.log("num stack after operation: ", evalStack);
					console.log("operator stack after operation: " + operator.symbol + " ==> ", oprStack.length);
					oprStack.forEach(opr => { console.log(opr) });

				} else {
					if (oprStack.length === 0) console.log("oprStack is empty");
					else console.log("token: " + token + " has higher or same priority as " + oprStack[oprStack.length - 1].symbol);
				}

				oprStack.unshift(operator);
				console.log("operator stack after adding operation ==> ", oprStack.length);
				oprStack.forEach(opr => { console.log(opr) });
			}
			console.log("---");
		}

		console.log("num stack after all operations: ", evalStack);
		console.log("operator stack after all operations: ", oprStack);

		console.log("");

		const len = oprStack.length;
		for (let i = 0; i < len; i++) {
			const o = oprStack.shift();

			console.log("Selected operation: " + o.symbol);
			console.log("num stack before popping elements: ", evalStack);

			// const b = evalStack.shift();
			// const a = evalStack.shift();
			let a = 0;
			let b = 0;
			if (o.symbol === "/") {
				b = evalStack.pop();
				a = evalStack.pop();
			} else {
				if (o.symbol === "-") {
					b = evalStack.shift();
					a = evalStack.shift();
				} else {
					a = evalStack.shift();
					b = evalStack.shift();
				}
			}

			console.log("Numbers popped out: " + a + " " + b);

			const res = o.operate(a, b);
			console.log("Operation " + o.symbol + " result: " + res);

			evalStack.unshift(res);
			console.log("num stack after operation: ", evalStack);
			console.log("operator stack after operation: " + o.symbol + " ==> ", oprStack.length);
			oprStack.forEach(opr => { console.log(opr) });

			console.log("---");
		}

		setDecimalInp(false);
		setExpression("0");
		setinpNum("0");

	};

	return (
		<div style={{margin:"5rem"} }>
			<div id="display" className={styles.display}>
				<label className={ styles.expression }>{ expression}</label>
				<label className={ styles.inpNum }>{inpNum}</label>
			</div>
			<button id="clear" onClick={clearInput}>AC</button>
			<div>
				{operations.map(op => { 
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
