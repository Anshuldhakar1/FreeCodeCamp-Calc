import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

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

    const [inpNumber, setInpNumber] = useState("0"); 
    const [inpDecimal, setDecimalinp] = useState(true);
    const [expression, setExpr] = useState("0");
    const [allowDirect, setAllowDirect] = useState(false);

     const addOperation = (oprType: string) => {
        try {
            let expr = "";
            if (allowDirect) {
                setAllowDirect(false);
                expr = inpNumber;
            }
            setInpNumber("0");
            switch (oprType) {
                case "add": expr = (expr !== "" ? expr : expression) + "+"; break;
                case "sub": expr = (expr !== "" ? expr : expression) + "-"; break;
                case "mul": expr = (expr !== "" ? expr : expression) + "*"; break;
                case "div": expr = (expr !== "" ? expr : expression) + "/";	break;
                default: throw new Error("Invalid Operation detected.");
            }
            setExpr(expr);
            setDecimalinp(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleNumClick = (value: string) => { 
        if (!allowDirect) {
            setInpNumber((inpNumber === "0" ? "" : inpNumber) + value);
            setExpr((expression === "0" ? "" : expression) + value);
        } else {
            setAllowDirect(false);
            setInpNumber(value);
            setExpr((expression === "0" || expression===inpNumber ? "" : expression) + value);
        }
    }

    const handleClear = () => { 
        setInpNumber("0");
        setDecimalinp(true);
        setExpr("0");
    };

    const handleResult = () => { 
        const inp = expression;
        const tokens = tokenize(inp);

        const newTokens = [];
        for (let i = 0; i < tokens.length; i++) 
            if (tokens[i] === "-" && "+/*".includes(tokens[i - 1])) {
                if (!"0123456789".includes(tokens[i + 1])) continue;
                newTokens.push(tokens[i-1]);
                newTokens.push( "-"+tokens[i+++1] );
            } else if (!("+/*-".includes(tokens[i]) && "+/*-".includes(tokens[i+1])))  // this is the main case for the numbers 
                newTokens.push(tokens[i]);
            
        const pf = infixToPostfix(newTokens);
        const res = evaluatePostfix(pf);
        let out = "";
        if (res) out = (res.toString().includes(".") ? parseFloat(res.toFixed(4)) : res).toString();

        setInpNumber(out);
        setExpr(out);
        setDecimalinp(true);
        setAllowDirect(true);
    };

    const handleDecimalInput = () => { 
        if (inpDecimal) {
            setInpNumber(inpNumber + ".");
            if (inpNumber === "0") setExpr(expression + "0.");
            else setExpr(expression + ".");
            setDecimalinp(false);
        }
    };

    const handleBack = () => { 
        const newInp = inpNumber.slice(0, inpNumber.length - 1);
        const newExpr = expression.slice(0, expression.length - 1);
        setInpNumber(newInp === "" ? "0" : newInp);
        setExpr(newExpr === "" ? "0" : newExpr); 
    };
    

    return (
        <div className={styles.container}>
            <div style={ {width:"12rem"}}>
                <div id="inputs">
                    <label id="expression">{expression}</label>
                    <div id="display">{inpNumber}</div>
                </div>
                <div className={styles.buttons}>
                    <button id="clear" onClick={() => { handleClear(); }}>AC</button>
                    <button id="back" onClick={() => { handleBack(); }}>C</button>
                    <button id="percent">%</button>
                    <button id="divide" onClick={() => { addOperation("div"); }}> / </button>
                    <button id="seven" onClick={() => { handleNumClick("7"); }}>7</button>
                    <button id="eight" onClick={() => { handleNumClick("8"); }}>8</button>
                    <button id="nine" onClick={() => { handleNumClick("9"); }}>9</button>
                    <button id="multiply" onClick={() => { addOperation("mul"); }}>x</button>
                    <button id="four" onClick={() => { handleNumClick("4"); }}>4</button>
                    <button id="five" onClick={() => { handleNumClick("5"); }}>5</button>
                    <button id="six" onClick={() => { handleNumClick("6"); }}>6</button>
                    <button id="subtract" onClick={() => { addOperation("sub"); }}>-</button>
                    <button id="one" onClick={() => { handleNumClick("1"); }}>1</button>
                    <button id="two" onClick={() => { handleNumClick("2"); }}>2</button>
                    <button id="three" onClick={() => { handleNumClick("3"); }}>3</button>
                    <button id="add" onClick={() => { addOperation("add"); }}> + </button>
                    <button id="zero" className={styles.zero} onClick={() => { handleNumClick("0"); }}>0</button>
                    <button id="decimal" onClick={() => { handleDecimalInput(); }}>.</button>
                    <button id="equals" onClick={() => { handleResult(); }}> = </button>
                </div>
            </div>
        </div>
    );
};

export default App;


                    // <div id="editable">
                    //     <button id="clear" onClick={() => { handleClear(); }}>AC</button>
                    //     <button id="back" onClick={() => { handleBack(); }}>C</button>
                    // </div>
                    // <div id="operations">
                    //     <button id="add" onClick={() => { addOperation("add"); }}> + </button>
                    //     <button id="subtract" onClick={() => { addOperation("sub"); }}> - </button>
                    //     <button id="multiply" onClick={() => { addOperation("mul"); }}> * </button>
                    //     <button id="divide" onClick={() => { addOperation("div"); }}> / </button>
                    // </div>
                    // <div id="numpad">
                    //     {
                    //         numbers.map((num) => {
                    //             return <button key={num.display} id={num.display} onClick={() => { handleNumClick(num.value.toString()); }}>{num.value}</button>
                    //         })
                    //     }
                    // </div>
                    // <div id="last-row">
                    //     <button id="zero" onClick={() => { handleNumClick("0"); }} >0</button>
                    //     <button id="decimal" onClick={() => { handleDecimalInput(); }}>.</button>
                    //     <button id="equals" onClick={() => { handleResult(); }}> = </button>
                    // </div>