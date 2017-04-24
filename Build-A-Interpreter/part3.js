/*
 The third simple interpret:
 enhance the lexical parse.
 1.input '3+5'.
 2.'5-3', '23+3'
 3.'5-2+12', '23+12+233-2'
 */
const [INTEGER, PLUS, MINUS, EOF] = ['INTEGER', 'PLUS', 'MINUS', 'EOF'];
const OPS = ['PLUS', 'MINUS'];

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
        console.log('Error parsing input. When ' + message);
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

    term() {
        var token = this.currentToken;
        this.eat(INTEGER);
        return Number(token.value);
    }

    expr() {
        this.currentToken = this.getNextToken();

        var result = this.term();


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

