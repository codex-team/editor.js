/**
 * Webpack configuration
 *
 * @author Codex Team
 * @copyright Khaydarov Murod
 */
'use strict';

module.exports = (env, argv) => {
  const path = require('path');
  const fs = require('fs');
  const TerserPlugin = require('terser-webpack-plugin');
  const pkg = require('./package.json');

  /**
   * Environment
   *
   * @type {any}
   */
  const NODE_ENV = argv.mode || 'development';
  const VERSION = process.env.VERSION || pkg.version;

  /**
   * Plugins for bundle
   *
   * @type {webpack}
   */
  const webpack = require('webpack');

  /**
   * Locales entries
   *
   * @type {array}
   */
  let locales = [];

  /**
   * Locales name
   *
   * @type {object}
   */
  const localesName = fs.readdirSync('./src/components/i18n/locales');

  return localesName.filter(localeName => !['en'].includes(localeName))
    .map(localeName => {
      const formatedLocale = localeName
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\-\w)/g, (word, index) => word.toUpperCase())
        .replace('-', '');

      return {
        entry: `./src/components/i18n/locales/${localeName}/index.ts`,

        output: {
          path: path.resolve(__dirname, 'locales'),
          filename: `${localeName}.js`,
          library: `EditorJSLocale${formatedLocale}`,
          libraryTarget: 'umd',
        },

        watchOptions: {
          aggregateTimeout: 50,
        },

        /**
         * Tell webpack what directories should be searched when resolving modules.
         */
        resolve: {
          modules: [path.join(__dirname, 'src'), 'node_modules'],
          extensions: ['.js', '.ts'],
        },

        plugins: [
          /** Pass variables into modules */
          new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            VERSION: JSON.stringify(VERSION),
          }),
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
                  },
                },
                {
                  loader: 'ts-loader',
                },
              ],
            },
          ],
        },

        optimization: {
          minimizer: [
            new TerserPlugin({
              cache: true,
              parallel: true,
            }),
          ],
        },
      };
    });
}
