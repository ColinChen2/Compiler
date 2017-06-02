/*
 The first simple interpret:
 1.input '3+5'.
 */
const [INTEGER, PLUS, EOF] = ['INTEGER', 'PLUS', 'EOF'];

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    getString() {
        return `Token(${this.type}, ${this.value})`;
    }
}

class Interpreter {
    constructor(text, pos = 0, currentToken) {
        this.text = text;
        this.pos = pos;
        this.currentToken = currentToken;
    }

    static error() {
        console.log('Error parsing input.');
    }

    getNextToken() {
        var text = this.text;
        var token, currentChar;

        if(this.pos > text.length - 1) {
            return new Token(EOF, null);
        }

        currentChar = text[this.pos];

        if(isNumeric(currentChar))  {
            token = new Token(INTEGER, currentChar);
            this.pos ++;
            return token;
        }

        if(currentChar === '+') {
            token = new Token(PLUS, currentChar);
            this.pos++;
            return token;
        }

        Interpreter.error();
    }

    //check the token type
    eat(tokenType) {
        if(this.currentToken.type === tokenType) {
            this.currentToken = this.getNextToken();
            console.log(this.currentToken.getString());
        } else {
            Interpreter.error();
        }
    }

    expr() {
        this.currentToken = this.getNextToken();
        var left = this.currentToken;
        this.eat(INTEGER);
        var op = this.currentToken;
        this.eat(PLUS);
        var right = this.currentToken;
        this.eat(INTEGER);
        return Number(left.value) + Number(right.value);
    }
}

function isNumeric(num) {
    return !isNaN(num)
}

function main() {
    var testString = process.argv[2];
    var interpreter = new Interpreter(testString);
    var result = interpreter.expr();
    console.log(result);
}

main();

//expect part2!