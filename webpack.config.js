/**
 * Webpack configuration
 *
 * @author Codex Team
 * @copyright Khaydarov Murod
 */
'use strict';

var pkg  = require('./package.json');
var path = require('path');

/**
 * Environment
 * @type {any}
 */
const NODE_ENV = process.env.NODE_ENV || 'development';
const VERSION  = process.env.VERSION || pkg.version;

/**
 * Plugins for bundle
 * @type {webpack}
 */
var webpack                     = require('webpack');
var ExtractTextWebpackPlugin    = require('extract-text-webpack-plugin');

module.exports = {

    entry: {
        "whatwg-fetch": "whatwg-fetch",
        "codex-editor": "./index"
    },
    output: {
        filename: "[name].js",
        library: ["codex"]
    },

    watch: true,

    watchOptions: {
        aggregateTimeOut: 100
    },

    devtool: NODE_ENV == 'development' ? "source-map" : null,

    resolve : {
        fallback: path.join(__dirname, "node_modules"),
        modulesDirectories : ['./node_modules', './modules'],
        extensions : ['', '.js', '.json']
    },

    resolveLoader : {
        modulesDirectories: ['./node_modules'],
        moduleTemplates: ["*-webpack-loader", "*-web-loader", "*-loader", "*"],
        extensions: ['', '.js']
    },

    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            VERSION: JSON.stringify(VERSION)
        })
    ],

    module : {

        loaders : [{
            test : /\.js$/,
            exclude: /(node_modules)/,
            loader : 'babel',
            query: {
                presets: [__dirname + '/node_modules/babel-preset-es2015']
            }
        },
        {
            test : /\.js$/,
            loader: 'eslint-loader',
            exclude: /(node_modules)/
        },
        {
            test : /\.css$/,
            exclude: /(node_modules)/,
            loader: ExtractTextWebpackPlugin.extract('style-loader', 'css-loader')
        }]
    }
};