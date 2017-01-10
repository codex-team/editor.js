/**
 * Webpack configuration
 *
 * @author Codex Team
 * @copyright Khaydarov Murod
 */
'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
var webpack = require('webpack');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

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
        modulesDirectories : ['./node_modules', './modules'],
        extensions : ['', '.js']
    },

    resolveLoader : {
        modulesDirectories: ['./node_modules'],
        moduleTemplates: ["*-webpack-loader", "*-web-loader", "*-loader", "*"],
        extensions: ['', '.js']
    },

    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),

        new webpack.ProvidePlugin({
            _ : 'lodash'
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
            test : /\.css$/,
            exclude: /(node_modules)/,
            loader: ExtractTextWebpackPlugin.extract('style-loader', 'css-loader')
        }]
    }
};