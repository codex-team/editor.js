/**
 * Webpack configuration
 *
 * @author Codex Team
 * @copyright Khaydarov Murod
 */
'use strict';

const pkg = require('./package.json');
const path = require('path');

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
const webpack = require('webpack');

/**
 * Options for the Babel
 */
const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true
  }
};



module.exports = {

  entry: {
    'codex-editor': ['@babel/polyfill/noConflict', './src/codex.ts']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    library: [ 'CodexEditor' ],
    libraryTarget: 'umd'
  },

  watch: true,
  watchOptions: {
    aggregateTimeout: 50
  },

  devtool: NODE_ENV === 'development' ? 'source-map' : null,

  /**
   * Tell webpack what directories should be searched when resolving modules.
   */
  resolve : {
    modules : [path.join(__dirname, 'src'),  'node_modules'],
    extensions: ['.js', '.ts'],
    alias: {
      'utils': path.resolve(__dirname + '/src/components/', './utils'),
      'dom': path.resolve(__dirname + '/src/components/', './dom'),
    }
  },

  plugins: [

    /** Pass variables into modules */
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      VERSION: JSON.stringify(VERSION)
    }),

    /** Block biuld if errors found */
    // new webpack.NoErrorsPlugin(),

  ],

  module : {
    rules : [
      {
        test: /\.ts$/,
        use: [
          babelLoader,
          {
            loader: 'ts-loader'
          },
          {
            loader: 'tslint-loader',
            options: {
              fix: true
            }
          }
        ]
      },
      {
        test : /\.js$/,
        use: [
          babelLoader,
          {
            loader: 'eslint-loader?fix=true&esModules=true',
          }
        ],
        exclude: [
          /(node_modules|build)/, // dont need to look in '/build' to prevent analyse __tmp_babel_helper.js
          /src[\\\/]components[\\\/]tools/
        ]
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
      },
      {
        test: /\.(svg)$/,
        use: [
          {
            loader: 'raw-loader',
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true
  },
};
