import { useState } from "react";

function tokenize(infix: string): string[] {
	const tokens: string[] = [];
	let token = '';
	for (let i = 0; i < infix.length; i++) {
		if (/[-+]?([0-9 .])?[0-9 .]+/.test(infix[i])) {
			token += infix[i];
			if (i + 1 < infix.length && /[-+]?([0-9 .])?[0-9 .]+/.test(infix[i + 1])) {
				continue;
			}
			tokens.push(token);
			token = '';
		} else if (infix[i] === '(' || infix[i] === ')' || infix[i] === '+' || infix[i] === '*' || infix[i] === '/') {
			if (token) {
				tokens.push(token);
				token = '';
			}
			tokens.push(infix[i]);
			continue;
		} else if (infix[i] === '-') {
			if (token) {
				tokens.push(token);
				token = '';
			}
			token += infix[i];
		}
		if (token) {
			tokens.push(token);
			token = '';
		}
	}
	if (token) {
		tokens.push(token);
	}
	return tokens;
}

function infixToPostfix(tokens: string[]): string {
	let result = '';
	const stack: string[] = [];
	for (const token of tokens) {
		if (/[-+]?([0-9 .])?[0-9 .]+/.test(token)) {
			result += token + ' ';
		} else if (token === '(') {
			stack.push(token);
		} else if (token === ')') {
			while (stack[stack.length - 1] !== '(') {
				result += stack.pop() + ' ';
			}
			stack.pop();
		} else {
			while (stack.length > 0 && getPrecedence(token) <= getPrecedence(stack[stack.length - 1])) {
				result += stack.pop() + ' ';
			}
			stack.push(token);
		}
	}
	while (stack.length > 0) {
		result += stack.pop() + ' ';
	}
	return result.trim();
}

function getPrecedence(op: string): number {
	switch (op) {
		case '+':
		case '-':
			return 1;
		case '*':
		case '/':
			return 2;
		default:
			return -1;
	}
}

function evaluatePostfix(postfix: string): number {
	const stack: number[] = [];
	const tokens = postfix.split(' ');
	for (const token of tokens) {
		if (!isNaN(Number(token))) {
			stack.push(Number(token));
		} else {
			const operand2 = stack.pop() as number;
			const operand1 = stack.pop() as number;
			switch (token) {
				case '+':
					stack.push(operand1 + operand2);
					break;
				case '-':
					stack.push(operand1 - operand2);
					break;
				case '*':
					stack.push(operand1 * operand2);
					break;
				case '/':
					stack.push(operand1 / operand2);
					break;
			}
		}
	}
	return stack.pop() as number;
}


export const App: React.FC = () => {

	interface n {
		display: string;
		value: number;
	}
	const numbers: Array<n> = [
		{ display:"one", value: 1 },
		{ display: "two", value: 2 },
		{ display: "three", value: 3 },
		{ display: "four", value: 4 },
		{ display: "five", value: 5 },
		{ display: "six", value: 6 },
		{ display: "seven", value: 7 },
		{ display: "eight", value: 8 },
		{ display: "nine", value: 9 }
	];

	const [inpNumber, setInpNumber] = useState("0"); 
	const [inpDecimal, setDecimalinp] = useState(true);
	const [expression, setExpr] = useState("0");

	// const [lastOperator, setLastOperator] = useState("");

	// const addOperation = (oprType: string) => {
	// 	try {
	// 		setInpNumber("0");
	// 		let updatedExpression = expression;

	// 		// Handle consecutive operators
	// 		if (oprType === "-" && lastOperator === "-") {
	// 			updatedExpression = expression.slice(0, -1) + oprType;
	// 		} else {
	// 			updatedExpression += oprType;
	// 		}

	// 		setExpr(updatedExpression);
	// 		setLastOperator(oprType);
	// 		setDecimalinp(true);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };


	const addOperation = (oprType: string) => {
		try {
			setInpNumber("0");
			const lastChar = expression.slice(-1);
			const operators = ["+", "-", "*", "/"];

			if (operators.includes(lastChar)) {
				setExpr(expression.slice(0, -1));
			}
			switch (oprType) {
				case "add": console.log("addition");
					setExpr(expression + "+");
					break;
				
				case "sub": console.log("subtraction");
					setExpr(expression + "-");
					break;
				
				case "mul": console.log("multiplication");
					setExpr(expression + "*");
					break;
				
				case "div": console.log("division");
					setExpr(expression + "/");
					break;
				default: throw new Error("Invalid Operation detected.");
			}
			setDecimalinp(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleNumClick = (value: string) => { 
		setInpNumber((inpNumber === "0" ? "" : inpNumber) + value);
		setExpr((expression === "0" ? "" : expression) + value);
	}

	const handleClear = () => { 
		setInpNumber("0");
		setDecimalinp(true);
		setExpr("0");
	};

	const handleResult = () => { 
		const inp = expression;
		const tokens = tokenize(inp);

		const pf = infixToPostfix(tokens);
		const res = evaluatePostfix(pf);

		setInpNumber((res.toString().includes(".") ? parseFloat(res.toFixed(4)) : res).toString());
		setExpr("0");
		setDecimalinp(true);
	};

	const handleDecimalInput = () => { 
		if (inpDecimal) {
			setInpNumber(inpNumber + ".");
			if (inpNumber === "0") setExpr(expression + "0.");
			else setExpr(expression + ".");
			setDecimalinp(false);
		}
	};

	return (
		<div style={{ margin: "15rem" }}>
			<div id="inputs">
				<div id="display">{inpNumber}</div>
				<label id="expression">{ expression}</label>
			</div>
			<div id="editable">
				<button id="clear" onClick={() => { handleClear(); }}>AC</button>
				<button id="back">C</button>
			</div>
			<div id="operations">
				<button id="add" onClick={() => { addOperation("add"); }}> + </button>
				<button id="subtract" onClick={() => { addOperation("sub"); }}> - </button>
				<button id="multiply" onClick={() => { addOperation("mul"); }}> * </button>
				<button id="divide" onClick={() => { addOperation("div"); }}> / </button>
			</div>
			<div id="numpad">
				{
					numbers.map((num) => { 
						return <button key={num.display} id={num.display} onClick={() => { handleNumClick(num.value.toString()); }}>{ num.value}</button>
					})
				}
			</div>
			<div id="last-row">
				<button id="zero" onClick={() => { handleNumClick("0"); }} >0</button>
				<button id="decimal" onClick={() => { handleDecimalInput(); }}>.</button>
				<button id="equals" onClick={() => { handleResult(); }}> = </button>
			</div>
		</div>
	);
};

export default App;