// var fs = require('fs');
// var jsdom = require('jsdom');
var d3 = require('d3');
var calculator = require('../chapter2/part7');

const [svgW, svgH] = [800, 400];
const [branchOffsetX, branchOffsetY] = [20, 40];
const [circleRadius] = [12];

class PaintNode {

    constructor(points) {
        //start points
        this.lineX = points.circleX;
        this.lineY = points.circleY;
        this.circleX = points.circleX;
        this.circleY = points.circleY
    }

    points() {
        return {
            circleX: this.circleX,
            circleY: this.circleY
        }
    }

    drawCircle() {
        d3.select('#g_circles').append('circle').attr('cx', this.circleX).attr('cy', this.circleY).attr('r', circleRadius);
    }

    drawText(label) {
        d3.select("#g_texts").append('text').attr('x', this.circleX).attr('y', this.circleY + 5).text(label);
    }

    drawLeftLine() {
        var me = this;
        var line = d3.select("#g_lines")
            .append('line').attr('x1', this.lineX).attr('y1', this.lineY);

        this.circleX = this.circleX - branchOffsetX;
        this.circleY = this.circleY + branchOffsetY;

        line.attr('x2', this.circleX).attr('y2', this.circleY);

        console.log(this.points());
        return this.points();
    }

    drawRightLine() {
        var me = this;
        var line = d3.select("#g_lines")
            .append('line').attr('x1', this.lineX).attr('y1', this.lineY);

        this.circleX = this.circleX + branchOffsetX*2;

        line.attr('x2', this.circleX).attr('y2', this.circleY);

        console.log(this.points());
        return this.points();
    }
}

/*
1.use own look data.
2.use d3.
 */
function renderTree(tree, points) {
    var paintNode = new PaintNode(points);
    var pointsLeft, pointsRight;

    paintNode.drawCircle();
    paintNode.drawText(tree.token.value);

    if(tree.left) {
        pointsLeft = paintNode.drawLeftLine();
        renderTree(tree.left, pointsLeft);
    }

    if(tree.right) {
        pointsRight = paintNode.drawRightLine();
        renderTree(tree.right, pointsRight);
    }

    return true;
}

function initSVG() {
    d3.select("#container-result")
        .append("svg").attr("width", svgW).attr("height", svgH)
        .append("g").attr('id', "g_lines");
    d3.select("svg").append("g").attr("id", "g_circles");
    d3.select("svg").append("g").attr("id", "g_texts");
}

function initMathInput(startPoint) {
    var input = document.getElementById('input-math');
    var button = document.getElementById('button-ok');

    button.addEventListener('click', function () {
        renderTree(calculator.calculate(input.value), startPoint);
    });
}

function main() {
    var startPoint = {
        circleX: 200,
        circleY: 80
    };
    initSVG();
    initMathInput(startPoint);
}

main();



