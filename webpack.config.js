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
var webpack        = require('webpack');

/**
 * File system
 */
var fs = require('fs');

/**
 * Available CodeX Editor modules placed in components/modules folder
 * They will required automatically.
 * Folders and files starting with '_' will be skipped
 * @type {Array}
 */
var editorModules = fs.readdirSync('./src/components/modules').filter( name => /.(j|t)s$/.test(name) && name.substring(0,1) !== '_' );

editorModules.forEach( name => {
  console.log('Require modules/' + name);
});

/**
 * Options for the Babel
 */
var babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    plugins: [
      /**
       * Dont need to use «.default» after «export default Class Ui {}»
       * @see  {@link https://github.com/59naga/babel-plugin-add-module-exports}
       */
      // 'add-module-exports',
      /**
       * Babel transforms some awesome ES6 features to ES5 with extra code, such as Class, JSX.
       * This plugin makes all generated extra codes to one module which significantly reduces the bundle code size.
       *
       * {@link https://github.com/brianZeng/babel-plugin-transform-helper}
       * @since 11 dec 2017 - removed due to plugin does not supports class inheritance
       */
      // ['babel-plugin-transform-helper', {
      //   helperFilename:'build/__tmp_babel_helpers.js'
      // }],
      // 'class-display-name',
    ]
  }
};



module.exports = {

  entry: {
    'codex-editor': [ './src/codex' ]
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

  devtool: NODE_ENV == 'development' ? 'source-map' : null,

  /**
   * Tell webpack what directories should be searched when resolving modules.
   */
  resolve : {
    // fallback: path.join(__dirname, 'node_modules'),
    modules : [ path.join(__dirname, "src"),  "node_modules"],
    extensions: ['.js', '.ts'],
    alias: {
      'utils': path.resolve(__dirname + '/src/components/', './utils'),
      'dom': path.resolve(__dirname + '/src/components/', './dom'),
    }
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

    /**
     * Setting up a dynamic requires that we use to autoload Editor Modules from 'components/modules' dir
     * {@link https://webpack.js.org/plugins/context-replacement-plugin/}
     */
    new webpack.ContextReplacementPlugin(
      /src\/components\/modules/,
      false, // newContentRecursive=false because we dont need to include folders
      new RegExp(
        '[^_]' + // dont match names started with '_'
        `(${editorModules.join('|')})` + // module names pattern: (events.js|ui.js|...)
        '$' // at the end of path
      )
    ),

    /**
     * Automatically load global visible modules
     * instead of having to import/require them everywhere.
     */
    new webpack.ProvidePlugin({
      '_': 'utils',
      '$': 'dom',
      'Module': './../__module.ts',
    }),

    /** Минифицируем CSS и JS */
    // new webpack.optimize.UglifyJsPlugin({
    /** Disable warning messages. Cant disable uglify for 3rd party libs such as html-janitor */
    // compress: {
    //   warnings: false
    // }
    // }),

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
    // minimize: true
  },
};
