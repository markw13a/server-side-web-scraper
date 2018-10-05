const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, './markw13a.co.uk/build');
const APP_DIR = path.resolve(__dirname, './markw13a.co.uk/src/client');

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
             test: [/\.js$/, /\.jsx$/],
              use: [{
                loader: "babel-loader",
                options: {
                  cacheDirectory: true,
                  presets: ['react', 'es2015'] // Transpiles JSX and ES6
                }
              }]            
            }
           ]
    }
};


module.exports = config;