/*
 The second simple interpret:
 enhance the lexical parse.
 1.input '3+5'.
 2.'5-3', '23+3'
 */
const [INTEGER, PLUS, MINUS, EOF] = ['INTEGER', 'PLUS', 'MINUS', 'EOF'];

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
        this.currentChar = this.text[this.pos];
    }

    static error(message) {
        console.log('Error parsing input.' + message);
    }

    advance() {
        var text = this.text;
        this.pos++;
        if (this.pos > text.length - 1) {
            this.currentChar = null;
        } else {
            this.currentChar = text[this.pos]
        }
    }

    skipWhitespace() {
        while (this.currentChar && isSpace(this.currentChar)) {
            this.advance();
        }
    }

    integer() {
        var result = '';
        while (this.currentChar && isNumber(this.currentChar)) {
            result = result + this.currentChar;
            this.advance();
        }

        return Number(result);
    }

    getNextToken() {
        while (this.currentChar) {
            if (isSpace(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            if (isNumber(this.currentChar)) {
                return new Token(INTEGER, this.integer())
            }

            if (this.currentChar === '+') {
                this.advance();
                return new Token(PLUS, '+');
            }

            if (this.currentChar === '-') {
                this.advance();
                return new Token(MINUS, '-');
            }

            Interpreter.error('nextToken');
        }

        return new Token(EOF, null)
    }

    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.getNextToken();
        } else {
            Interpreter.error('eat');
        }
    }

    expr() {
        this.currentToken = this.getNextToken();
        var left = this.currentToken;
        this.eat(INTEGER);

        var op = this.currentToken;
        if (op.type === PLUS) {
            this.eat(PLUS);
        } else {
            this.eat(MINUS);
        }

        var right = this.currentToken;
        this.eat(INTEGER);

        var result;
        if (op.type === PLUS) {
            result = Number(left.value) + Number(right.value);
        } else {
            result = Number(left.value) - Number(right.value);
        }

        return result;
    }
}

function isSpace(str) {
    const space = /\s/;
    return space.test(str);
}

function isNumber(str) {
    const digit = /\d/;
    return digit.test(str);
}

function main() {
    var testString = process.argv[2];
    var interpreter = new Interpreter(testString);
    var result = interpreter.expr();
    console.log(result);
}

main();
