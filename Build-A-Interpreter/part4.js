/*
 -------      ------------
 lexer    ->  interpreter
 -------      ------------
 1.input '3+5'.
 2.'5-3', '23+3'
 3.'5-2+12', '23+12+233-2'
 4.'7*4/2'
 */
const [INTEGER, MUL, DIV, EOF] = ['INTEGER', 'MUL', 'DIV', 'EOF'];
const OPS = ['MUL', 'DIV'];

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    getString() {
        return `Token(${this.type}, ${this.value})`;
    }
}

class Lexer {
    constructor(text) {
        this.text = text;
        this.pos = 0;
        this.currentChar = this.text[this.pos];
    }

    static error() {
        console.log('Invalid character');
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

            if (this.currentChar === '*') {
                this.advance();
                return new Token(MUL, '*');
            }

            if (this.currentChar === '/') {
                this.advance();
                return new Token(DIV, '/');
            }

            Lexer.error();
        }

        return new Token(EOF, null)
    }
}

class Interpreter {
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
    }

    static error() {
        console.log('Invalid syntax');
    }

    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            Interpreter.error('eat');
        }
    }

    factor() {
        var token = this.currentToken;
        this.eat(INTEGER);
        return Number(token.value);
    }

    /*
     expr   : factor ((MUL | DIV) factor)*
     factor : INTEGER
     */
    expr() {
        var result = this.factor();

        while (OPS.includes(this.currentToken.type)) {
            var token = this.currentToken;

            if (token.type === MUL) {
                this.eat(MUL);
                result = result * this.factor();
            } else if (token.type === DIV) {
                this.eat(DIV);
                result = result / this.factor();
            }
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
    var lexer = new Lexer(testString);
    var interpreter = new Interpreter(lexer);
    var result = interpreter.expr();
    console.log(result);
}

main();

