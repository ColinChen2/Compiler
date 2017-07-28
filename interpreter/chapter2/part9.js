/*
parse the Pascal program:

BEGIN
    BEGIN
        number := 2;
        a := number;
        b := 10 * a + 10 * number / 4;
        c := a - - b
    END;
    x := 11;
END.
 */

const [INTEGER, PLUS, MINUS, MUL, DIV, LPAREN, RPAREN, EOF] = ['INTEGER', 'PLUS', 'MINUS', 'MUL', 'DIV', '(', ')', 'EOF'];
const PREFIRST = ['MUL', 'DIV'];
const PRESECOND = ['PLUS', 'MINUS'];
const [BEGIN, END, ID, DOT, SEMICOLON, ASSIGN] = ['BEGIN', 'END', 'ID', '.', ';', ':='];

//lexer
class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    getString() {
        return `Token(${this.type}, ${this.value})`;
    }
}

const RESERVED_KEYWORDS = {
    'BEGIN': new Token('BEGIN', 'BEGIN'),
    'END': new Token('END', 'END'),
};

function isSpace(str) {
    const space = /\s/;
    return space.test(str);
}

function isNumber(str) {
    const digit = /\d/;
    return digit.test(str);
}

function isAlpha(str) {
    const digit = /\[a-zA-Z]/;
    return digit.test(str);
}

function isColon(str) {
    const digit = /^:$/;
    return digit.test(str);
}

function isalnum() {
    const digit = /^[a-zA-Z0-9]+$/;
    return digit.test(str);
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
        let text = this.text;
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
        let result = '';
        while (this.currentChar && isNumber(this.currentChar)) {
            result = result + this.currentChar;
            this.advance();
        }

        return Number(result);
    }

    peek() {
        let peek_pos = this.pos + 1;
        if (peek_pos > this.text.length - 1) {
            return null;
        }

        return this.text[peek_pos];
    }

    id() {
        let result = '';
        while (this.currentChar && isalnum(this.currentChar)) {
            result = result + this.currentChar;
            this.advance();
        }

        return RESERVED_KEYWORDS[result] || new Token(ID, result);
    }

    getNextToken() {
        while (this.currentChar) {
            if (isSpace(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            if (isAlpha(this.currentChar)) {
                //that is why we need define id first. isAlpha check is not enough?
                //but python has not define id.
                return id();
            }

            if (isNumber(this.currentChar)) {
                return new Token(INTEGER, this.integer())
            }

            if (isColon(this.currentChar) && this.peek() === "=") {
                this.advance();
                this.advance();
                return new Token(ASSIGN, ":=");
            }

            if (this.currentChar === ";") {
                this.advance();
                return new Token(SEMICOLON, ';');
            }

            if (this.currentChar === ".") {
                this.advance();
                return new Token(DOT, '.');
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

//parse
class Compound {
    constructor() {
        this.children = [];
    }
}

class Assign {
    constructor(left, op, right) {
        this.left = left;
        this.op = op;
        this.right = right;
    }
}

class Var {
    constructor(token) {
        this.token = token;
        this.value = token.value;
    }
}

class NoOp {
    constructor() {
        this.value = "NoOp";
    }
}

class Parser {
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

    //need eat?
    empty() {
      return new NoOp();
    }

    variable() {
        let node =  new Var(this.currentToken);
        this.eat(ID);
        return node;
    }

    assign() {
        let id = this.variable();
        this.eat(ASSIGN);
        let expr = this.expr();
        return new Assign(id, ASSIGN, expr);
    }

    statement() {
        let node;
        if(this.currentToken.type === BEGIN) {
            node = this.compound();
            return node;
        }

        if(this.currentToken.type === ID) {
            node = this.assign();
            return node;
        }

        node = this.empty();
        return node;

    }

    statementList() {
        let node = this.statement();
        let nodes = [node];

        //should use while?
        if(this.currentToken.type === SEMICOLON) {
            this.eat(SEMICOLON);
            let childNodes = this.statementList();
            nodes.concat(childNodes);
        }
        return nodes;
    }

    compound() {
        this.eat(BEGIN);

        let root = new Compound();
        let nodes = this.statementList();

        this.eat(END);
        for(let node in nodes) {
            root.children.push(node);
        }

        return root;
    }

    program() {
        let node = this.compound();
        this.eat(DOT);
        return node;
    }
}




