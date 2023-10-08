
// 	Features:

import { useState } from "react";

// 9)  In any order, I should be able to add, subtract, multiply and divide a chain of numbers of any length,
// 	   and when I hit =, the correct result should be shown in the element with the id of display.

// 12)  I should be able to perform any operation (+, -, *, /) on numbers containing decimal points

// 13)  If 2 or more operators are entered consecutively, the operation performed should be the last
//      operator entered(excluding the negative(-) sign).For example, if 5 + * 7 = is entered, the
//      result should be 35(i.e. 5 * 7); if 5 * - 5 = is entered, the result should be - 25(i.e. 5 * (-5))

// 14)  Pressing an operator immediately following = should start a new calculation that operates on
//      the result of the previous evaluation.

// 15)  My calculator should have several decimal places of precision when it comes to rounding 
//      (note that there is no exact standard, but you should be able to handle calculations 
// 	    like 2 / 7 with reasonable precision to at least 4 decimal places).

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

	const addOperation = (oprType: string) => {
		try {
			setExpr((expression === "0" ? "" : expression) + inpNumber);
			switch (oprType) {
				case "add": console.log("addition");
					setInpNumber("+");
					break;
				
				case "sub": console.log("subtraction");
					setInpNumber("-");
					break;
				
				case "mul": console.log("multiplication");
					setInpNumber("*");
					break;
				
				case "div": console.log("division");
					setInpNumber("/");
					break;
				default: throw new Error("Invalid Operation detected.");
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleNumClick = (value: string) => { 
		if ("0123456789.".includes(inpNumber))
			setInpNumber((inpNumber === "0" ? "" : inpNumber) + value);
		else {
			setExpr(expression + inpNumber);
			setInpNumber(value);
		}
	}

	const handleClear = () => { 
		setInpNumber("0");
		setDecimalinp(true);
		setExpr("0");
	};

	const handleDecimalInput = () => { 
		if (inpDecimal) {
			setInpNumber(inpNumber + ".");
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
				<button> = </button>
			</div>
		</div>
	);
};

export default App;