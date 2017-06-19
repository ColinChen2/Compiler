/**
 * version1 has some problem, so in v2:
 * 1.Use D3 adequately. we can d3-hierarchy, d3-shape
 * 2.Use group to set start.
 */

var d3 = Object.assign({}, require("d3-selection"), require('d3-hierarchy'), require('d3-shape'));
var calculator = require('part8');

const [svgW, svgH] = [800, 400];
const [circleRadius] = [15];
const NODE_SIZE = [80, 40];
const ROOT_POINT = {x: 200, y: 40};

function renderCircles(data) {
    var circles = d3.select('#g_circles').selectAll('circle').data(data);

    circles.exit().remove();

    circles.enter().append('circle').attr('r', circleRadius).merge(circles).attr('cx', function (d) {
        return d.x;
    }).attr('cy', function (d) {
        return d.y;
    });
}

function renderTexts(data) {
    var texts = d3.select('#g_texts').selectAll('text').data(data);

    texts.exit().remove();

    texts.enter().append('text').merge(texts).text(function (d) {
        return d.data.token.value;
    }).attr('x', function (d) {
        return d.x;
    }).attr('y', function (d) {
        return d.y;
    }).attr('dy', 4);
}

function renderLines(data) {
    var link = d3.linkVertical()
        .x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        });

    var lines = d3.select('#g_lines').selectAll('path').data(data);

    lines.exit().remove();
    lines.enter().append('path').merge(lines).classed('link', true).attr('d', link);
}

function renderTree(data) {
    var root = d3.hierarchy(data, function children(d) {
        var children = [];

        if (d.left) {
            children.push(d.left);
        }
        if (d.right) {
            children.push(d.right);
        }
        if (d.expr) {
            children.push(d.expr);
        }

        return children;
    });

    var bTree = d3.tree().nodeSize(NODE_SIZE);
    var treeData = bTree(root);

    //circles
    renderCircles(treeData.descendants());

    //texts
    renderTexts(treeData.descendants());

    //lines
    renderLines(treeData.links());
}

function initSVG() {
    var svg = d3.select("#container-result").append("svg").attr("width", svgW).attr("height", svgH)
        .append("g").attr("transform", "translate(" + ROOT_POINT.x + "," + ROOT_POINT.y + ")");

    svg.append("g").attr('id', "g_lines");
    svg.append("g").attr("id", "g_circles");
    svg.append("g").attr("id", "g_texts");
}

function initMathInput() {
    var input = document.getElementById('input-math');
    var button = document.getElementById('button-ok');

    button.addEventListener('click', function () {
        renderTree(calculator.calculate(input.value));
    });
}

function main() {
    initSVG();
    initMathInput();
}

main();
