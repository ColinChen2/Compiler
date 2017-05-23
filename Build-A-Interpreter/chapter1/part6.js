/*
 -------      ------------
 lexer    ->  interpreter
 -------      ------------
 1.input '3+5'.
 2.'5-3', '23+3'
 3.'5-2+12', '23+12+233-2'
 4.'7*4/2'
 5.'2+7*4'
 6.'7+3*(10-2)'
 */

const [INTEGER, PLUS, MINUS, MUL, DIV, LPAREN, RPAREN, EOF] = ['INTEGER', 'PLUS', 'MINUS', 'MUL', 'DIV', '(', ')', 'EOF'];
const PREFIRST = ['MUL', 'DIV'];
const PRESECOND = ['PLUS', 'MINUS'];

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
        throw 'Invalid character';
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

            if (this.currentChar === '*') {
                this.advance();
                return new Token(MUL, '*');
            }

            if (this.currentChar === '/') {
                this.advance();
                return new Token(DIV, '/');
            }

            if (this.currentChar === '(') {
                this.advance();
                return new Token(LPAREN, '(');
            }

            if (this.currentChar === ')') {
                this.advance();
                return new Token(RPAREN, ')');
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

    static error(error) {
        throw `Invalid syntax: ${error}`;
    }

    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            Interpreter.error(`eat ${tokenType}`);
        }
    }

    factor() {
        var token = this.currentToken;
        var result;

        if (token.type === INTEGER) {
            this.eat(INTEGER);
            return Number(token.value);
        }

        if (token.type === LPAREN) {
            this.eat(LPAREN);
            result = this.expr();
            this.eat(RPAREN);
            return result;
        }
    }

    term() {
        var result = this.factor();

        while (PREFIRST.includes(this.currentToken.type)) {
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

    /*
     expr   : term ((plus | minus) term)*
     term   : factor ((MUL | DIV) factor)*
     factor : INTEGER | LPAREN expr RPAREN
     */
    expr() {
        var result = this.term();

        while (PRESECOND.includes(this.currentToken.type)) {
            var token = this.currentToken;

            if (token.type === PLUS) {
                this.eat(PLUS);
                result = result + this.term();
            } else if (token.type === MINUS) {
                this.eat(MINUS);
                result = result - this.term();
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
