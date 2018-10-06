const webpack = require('webpack');
const path = require('path');

const config = {
    entry: {
        'markw13a.co.uk/build/bundle': './markw13a.co.uk/src/client',
        'unofficialtranslations.com/build/bundle':  './unofficialtranslations.com/src/client'
    },
    output: {
        filename: '[name].js',
        path: __dirname
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
    },
    resolve: {
        extensions: ['.js', '.jsx'],
      }
};


module.exports = config;