const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: {
        tree1: './docs/example/part7/binaryTree1.js',
        tree2: './docs/example/part7/binaryTree2.js',
        tree8: './docs/example/part8/binaryTree8.js',
        tree9: './docs/example/part9/binaryTree9.js',
    },
    output: {
        path: path.resolve(__dirname, 'docs/dist'),
        filename: './[name].bundle.js'
    },
    resolve: {
        alias: {
            part7: path.resolve(__dirname, 'interpreter/chapter2/part7.js'),
            part8: path.resolve(__dirname, 'interpreter/chapter2/part8.js'),
            part9: path.resolve(__dirname, 'interpreter/chapter2/part9.js')
        }
    }
};