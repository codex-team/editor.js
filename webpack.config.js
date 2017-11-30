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
var webpack              = require('webpack');
var ExtractTextPlugin    = require('extract-text-webpack-plugin');

var fs = require('fs');

/**
 * Available CodeX Editor modules placed in components/modules folder
 * They will required automatically.
 * Folders and files starting with '_' will be skipped
 * @type {Array}
 */
var editorModules = fs.readdirSync('./src/components/modules').filter( name => /.js$/.test(name) && name.substring(0,1) !== '_' );

editorModules.forEach( name => {
    console.log('Require modules/' + name);
});


module.exports = {

    entry: {
        'codex-editor': './src/codex'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        library: [ 'CodexEditor' ]
    },

    watch: true,

    watchOptions: {
        aggregateTimeout: 50
    },

    devtool: NODE_ENV == 'development' ? 'source-map' : null,

    /**
     * Tell webpack what directories should be searched when resolving modules.
     */
    resolve : {
        // fallback: path.join(__dirname, 'node_modules'),
        modules : [ path.join(__dirname, "src"),  "node_modules"]
    },
    //

    // resolveLoader : {
        // modules: [ path.resolve(__dirname, "src"), "node_modules" ],
        // moduleTemplates: ['*-webpack-loader', '*-web-loader', '*-loader', '*'],
        // extensions: ['.js']
    // },

    plugins: [

        /** Pass variables into modules */
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            VERSION: JSON.stringify(VERSION),
            editorModules: JSON.stringify(editorModules)
        }),

        /** Минифицируем CSS и JS */
        // new webpack.optimize.UglifyJsPlugin({
            /** Disable warning messages. Cant disable uglify for 3rd party libs such as html-janitor */
            // compress: {
            //     warnings: false
            // }
        // }),

        /** Block biuld if errors found */
        // new webpack.NoErrorsPlugin(),

    ],

    module : {
        rules : [
            {
                test : /\.js$/,
                exclude: /node_modules/,
                use : {
                    loader: 'babel-loader',
                    options: {
                        presets: [ __dirname + '/node_modules/babel-preset-es2015' ],
                        plugins: ['class-display-name']
                    }
                }
            },
            {
                test : /\.js$/,
                use: 'eslint-loader?fix=true',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            // minimize: 1,
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
                // use: ExtractTextPlugin.extract([
                //     {
                //         loader: 'css-loader',
                //         options: {
                //             // minimize: 1,
                //             importLoaders: 1
                //         }
                //     },
                //     'postcss-loader'
                // ])
            }
        ]
    }
};