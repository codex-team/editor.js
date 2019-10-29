/**
 * Webpack configuration
 *
 * @author Codex Team
 */
'use strict';

module.exports = (env, argv) => {
  const path = require('path');
  const TerserPlugin = require('terser-webpack-plugin');
  const {LicenseWebpackPlugin} = require('license-webpack-plugin');
  const pkg = require('./package.json');

  /**
   * Environment
   * @type {any}
   */
  const NODE_ENV = argv.mode || 'development';
  const VERSION  = process.env.VERSION || pkg.version;

  /**
   * Plugins for bundle
   * @type {webpack}
   */
  const webpack = require('webpack');

  return {
    entry: {
      'tooltip': ['@babel/polyfill/noConflict', './src/index.ts']
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      library: [ 'tooltip' ],
      libraryTarget: 'umd'
    },

    watchOptions: {
      aggregateTimeout: 50
    },

    /**
     * Tell webpack what directories should be searched when resolving modules.
     */
    resolve: {
      modules: [path.join(__dirname, 'src'),  'node_modules'],
      extensions: ['.js', '.ts']
    },

    plugins: [
      /** Pass variables into modules */
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV),
        VERSION: JSON.stringify(VERSION)
      }),

      new webpack.BannerPlugin({
        banner: `Editor.js\n\n@version ${VERSION}\n\n@licence Apache-2.0\n@author CodeX <https://codex.so>\n\n`
      }),

      new LicenseWebpackPlugin()
    ],

    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              }
            },
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
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            'postcss-loader'
          ]
        },
      ]
    },

    devtool: NODE_ENV === 'development' ? 'source-map' : false,

    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true
        })
      ]
    }
  };
};
