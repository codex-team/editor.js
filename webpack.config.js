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

var versioning = VERSION.split('.');

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
            VERSION: VERSION,
            MAJOR: parseInt(versioning[0]),
            MINOR: versioning[1],
            BUILD: versioning[2]
        }),

        new webpack.EnvironmentPlugin('VERSION', pkg.version),

        new webpack.ProvidePlugin({
            _ : 'lodash'
        })
    ],

    module : {

        loaders : [{
            test : /\.js$/,
            loader : 'babel',
            query: {
                presets: [__dirname + '/node_modules/babel-preset-es2015']
            }
        },
        {
            test : /\.js$/,
            loader: 'eslint-loader',
            exclude: /node_modules/
        },
        {
            test: /node_modules\/entities\/.*\.json$/,
            include : /(node_modules)/,
            loader: 'json'
        },
        {
            test : /\.css$/,
            exclude: /(node_modules)/,
            loader: ExtractTextWebpackPlugin.extract('style-loader', 'css-loader')
        }]
    }
};