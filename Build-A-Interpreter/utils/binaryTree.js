// var fs = require('fs');
// var d3 = require('d3');
// var jsdom = require('jsdom');

const [branchOffsetX, branchOffsetY] = [20, 30];
const [circleRadius] = [12];

class PaintNode {

    constructor(points) {
        //start points
        this.points = points;
        this.lineX = points.lineX;
        this.lineY = points.lineY;
        this.circleX = points.circleX;
        this.circleY = points.circleY
    }

    drawCircle() {
        this.circleX;
        return this.points;
    }

    drawLeftLine() {
        leftline();
        return this.points;
    }

    drawRightLine() {
        rightLine();
        return this.points;
    }
}

function renderTree(tree, points) {
    var paintNode = new PaintNode(points);
    var pointsLeft, pointsRight;

    paintNode.drawCircle(tree.token);

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



