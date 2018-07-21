const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, './build');
const APP_DIR = path.resolve(__dirname, './src/client');

const config = {
    entry: {
        main: APP_DIR + '/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: BUILD_DIR
    },
    module: {
        rules: [
            {
              use: [{
                loader: "babel-loader",
                options: {
                  cacheDirectory: true,
                  presets: ['react', 'es2015'] // Transpiles JSX and ES6
                }
              }]
            }
           ]
    },
    node: {
        __dirname: true
    }
};


module.exports = config;