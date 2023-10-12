import { useEffect, useState } from "react";
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
    const [expression, setExpr] = useState("");
    const [allowDirect, setAllowDirect] = useState(false);

     const addOperation = (oprType: string) => {
        try {
            let expr = "";
            if (allowDirect) {
                setAllowDirect(false);
                expr = inpNumber;
            }
            switch (oprType) {
                case "+": expr = (expr !== "" ? expr : expression) + "+"; break;
                case "-": expr = (expr !== "" ? expr : expression) + "-"; break;
                case "*": expr = (expr !== "" ? expr : expression) + "*"; break;
                case "/": expr = (expr !== "" ? expr : expression) + "/"; break;
                case "%": throw new Error("% is not been implemented yet.");
                default: throw new Error("Invalid Operation detected.");
            }
            setExpr(expr);
            setInpNumber("0");
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
            setExpr((expression === "0" || expression === inpNumber ? "" : expression) + value);
        }
    }


    const handleClear = () => { 
        setInpNumber("0");
        setDecimalinp(true);
        setExpr("");
    };

    const handleResult = () => { 
        if (expression === "" && inpNumber !== "") {
            return;
        }
        const tokens = tokenize(expression);

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
        
        let out = "0";
        if (res) out = (res.toString().includes(".") ? parseFloat(res.toFixed(4)) : res).toString();

        setInpNumber(out);
        setExpr("");
        setDecimalinp(true);
        setAllowDirect(true);
    };

    const handleDecimalInput = () => { 
        if (inpDecimal && !inpNumber.includes(".")) {
            let str = "";
            if (allowDirect) {
                setAllowDirect(false);
                str = inpNumber;
            }
            setInpNumber(inpNumber + ".");
            if (inpNumber === "0") setExpr(expression + "0.");
            else setExpr(expression+ str + ".");
            setDecimalinp(false);
        }
    };

    const handleBack = () => { 
        if (allowDirect) {
            setAllowDirect(false);
            setInpNumber("0");
            setExpr("");
            return;
        }

        const newInp = inpNumber.slice(0, inpNumber.length - 1);
        const newExpr = expression.slice(0, expression.length - 1);
        setInpNumber(newInp === "" ? "0" : newInp);
        setExpr(newExpr); 
    };

    interface btn  {
        id: string;
        classes: Array<string>;
        clickHandler: () => void;
        display: string;
    };

    const btns: Array<btn> = [
        { id: "clear", classes: [], clickHandler: () => { handleClear(); }, display: "AC" },
        { id: "back", classes: [], clickHandler: () => { handleBack(); }, display: "C" },
        { id: "percent", classes: [], clickHandler: () => { addOperation("%"); }, display: "%" },
        { id: "divide", classes: [], clickHandler: () => { addOperation("/"); }, display: "/" },
        { id: "seven", classes: [], clickHandler: () => { handleNumClick("7"); }, display: "7" },
        { id: "eight", classes: [], clickHandler: () => { handleNumClick("8"); }, display: "8" },
        { id: "nine", classes: [], clickHandler: () => { handleNumClick("9"); }, display: "9" },
        { id: "multiply", classes: [], clickHandler: () => { addOperation("*"); }, display: "x" },
        { id: "four", classes: [], clickHandler: () => { handleNumClick("4"); }, display: "4" },
        { id: "five", classes: [], clickHandler: () => { handleNumClick("5"); }, display: "5" },
        { id: "six", classes: [], clickHandler: () => { handleNumClick("6"); }, display: "6" },
        { id: "subtract", classes: [], clickHandler: () => { addOperation("-"); }, display: "-" },
        { id: "one", classes: [], clickHandler: () => { handleNumClick("1"); }, display: "1" },
        { id: "two", classes: [], clickHandler: () => { handleNumClick("2"); }, display: "2" },
        { id: "three", classes: [], clickHandler: () => { handleNumClick("3"); }, display: "3" },
        { id: "add", classes: [], clickHandler: () => { addOperation("+"); }, display: "+" },
        { id: "zero", classes: [styles.zero], clickHandler: () => { handleNumClick("0"); }, display: "0" },
        { id: "decimal", classes: [], clickHandler: () => { handleDecimalInput(); }, display: "." },
        { id: "equals", classes: [styles.accent], clickHandler: () => { handleResult(); }, display: "=" },
        ];


    return (
        <div className={styles.container}>
            <div>
                <div className={styles.inputs}>
                    <label id="expression" className={styles.expr}>{expression}</label>
                    <div id="display" className={styles.inpnum}>{inpNumber}</div>
                </div>
                <div className={styles.buttons}>
                    {
                        btns.map(btn => { 
                            return (
                                <button
                                    key={btn.id}
                                    id={btn.id}
                                    className={ btn.classes.join("+") }
                                    onClick={btn.clickHandler}
                                >{btn.display}</button>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default App;