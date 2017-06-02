const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: {
        tree1: './interpreter/example/binaryTree1.js',
        tree2: './interpreter/example/binaryTree2.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './[name].bundle.js'
    }
};