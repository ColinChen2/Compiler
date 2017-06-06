const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: {
        tree1: './docs/example/binaryTree1.js',
        tree2: './docs/example/binaryTree2.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './[name].bundle.js'
    },
    resolve: {
        alias: {
            part7: path.resolve(__dirname, 'interpreter/chapter2/part7.js')
        }
    }
};