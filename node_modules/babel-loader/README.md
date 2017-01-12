# babel-loader 
[![NPM Status](https://img.shields.io/npm/v/babel-loader.svg?style=flat)](https://www.npmjs.com/package/babel-loader) 
[![Build Status](https://travis-ci.org/babel/babel-loader.svg?branch=master)](https://travis-ci.org/babel/babel-loader) 
[![Build Status](https://ci.appveyor.com/api/projects/status/vgtpr2i5bykgyuqo/branch/master?svg=true)](https://ci.appveyor.com/project/danez/babel-loader/branch/master)
[![codecov](https://codecov.io/gh/babel/babel-loader/branch/master/graph/badge.svg)](https://codecov.io/gh/babel/babel-loader)
  > Babel is a compiler for writing next generation JavaScript.

  This package allows transpiling JavaScript files using [Babel](https://github.com/babel/babel) and [webpack](https://github.com/webpack/webpack).

  __Notes:__ Issues with the output should be reported on the babel [issue tracker](https://github.com/babel/babel/issues);

## Installation

```bash
npm install babel-loader babel-core babel-preset-es2015 webpack --save-dev
```

or

```bash
yarn add babel-loader babel-core babel-preset-es2015 webpack --dev
```

__Note:__ [npm](https://npmjs.com) deprecated [auto-installing of peerDependencies](https://github.com/npm/npm/issues/6565) since npm@3, so required peer dependencies like babel-core and webpack must be listed explicitly in your `package.json`.

__Note:__ If you're upgrading from babel 5 to babel 6, please take a look [at this guide](https://medium.com/@malyw/how-to-update-babel-5-x-6-x-d828c230ec53#.yqxukuzdk).

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

  Within your webpack configuration object, you'll need to add the babel-loader to the list of modules, like so:

  ```javascript
module: {
  loaders: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }
  ]
}
  ```

### Options

See the `babel` [options](http://babeljs.io/docs/usage/options/).

You can pass options to the loader by writing them as a [query string](https://github.com/webpack/loader-utils):

  ```javascript
module: {
  loaders: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader?presets[]=es2015'
    }
  ]
}
  ```

  or by using the [query property](https://webpack.github.io/docs/using-loaders.html#query-parameters):

  ```javascript
module: {
  loaders: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }
  ]
}
  ```

  This loader also supports the following loader-specific option:

  * `cacheDirectory`: Default `false`. When set, the given directory will be used to cache the results of the loader. Future webpack builds will attempt to read from the cache to avoid needing to run the potentially expensive Babel recompilation process on each run. If the value is blank (`loader: 'babel-loader?cacheDirectory'`) or `true` (`loader: babel-loader?cacheDirectory=true`) the loader will use the default cache directory in `node_modules/.cache/babel-loader` or fallback to the default OS temporary file directory if no `node_modules` folder could be found in any root directory.

  * `cacheIdentifier`: Default is a string composed by the babel-core's version, the babel-loader's version, the contents of .babelrc file if it exists and the value of the environment variable `BABEL_ENV` with a fallback to the `NODE_ENV` environment variable. This can be set to a custom value to force cache busting if the identifier changes.

  * `babelrc`: Default `true`.  When `false`, will ignore `.babelrc` files (except those referenced by the `extends` option).

  __Note:__ The `sourceMap` option is ignored, instead sourceMaps are automatically enabled when webpack is configured to use them (via the `devtool` config option).

## Troubleshooting

### babel-loader is slow!

  Make sure you are transforming as few files as possible. Because you are probably
  matching `/\.js$/`, you might be transforming the `node_modules` folder or other unwanted
  source.

  To exclude `node_modules`, see the `exclude` option in the `loaders` config as documented above.

  You can also speed up babel-loader by as much as 2x by using the `cacheDirectory` option.
  This will cache transformations to the filesystem.

### babel is injecting helpers into each file and bloating my code!

  babel uses very small helpers for common functions such as `_extend`. By default
  this will be added to every file that requires it.

  You can instead require the babel runtime as a separate module to avoid the duplication.

  The following configuration disables automatic per-file runtime injection in babel, instead
  requiring `babel-plugin-transform-runtime` and making all helper references use it.

  See the [docs](http://babeljs.io/docs/plugins/transform-runtime/) for more information.

  **NOTE:** You must run `npm install babel-plugin-transform-runtime --save-dev` to include this in your project and `babel-runtime` itself as a dependency with `npm install babel-runtime --save`.

```javascript
loaders: [
  // the 'transform-runtime' plugin tells babel to require the runtime
  // instead of inlining it.
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel-loader',
    query: {
      presets: ['es2015'],
      plugins: ['transform-runtime']
    }
  }
]
```

#### **NOTE:** transform-runtime & custom polyfills (e.g. Promise library)

Since [babel-plugin-transform-runtime](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-runtime) includes a polyfill that includes a custom [regenerator runtime](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js) and [core.js](https://github.com/zloirock/core-js), the following usual shimming method using `webpack.ProvidePlugin` will not work:

```javascript
// ...
        new webpack.ProvidePlugin({
            'Promise': 'bluebird'
        }),
// ...
```

The following approach will not work either:

```javascript
require('babel-runtime/core-js/promise').default = require('bluebird');

var promise = new Promise;
```

which outputs to (using `runtime`):

```javascript
'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

require('babel-runtime/core-js/promise')['default'] = require('bluebird');

var promise = new _Promise();
```

The previous `Promise` library is referenced and used before it is overridden.

One approach is to have a "bootstrap" step in your application that would first override the default globals before your application:

```javascript
// bootstrap.js

require('babel-runtime/core-js/promise').default = require('bluebird');

// ...

require('./app');
```

### The node API for `babel` has been moved to `babel-core`.

If you receive this message it means that you have the npm package `babel` installed and use the short notation of the loader in the webpack config (which is not valid anymore as of webpack 2.x):
```js
  {
    test: /\.js$/,
    loader: 'babel',
  }
```

Webpack then tries to load the `babel` package instead of the `babel-loader`.

To fix this you should uninstall the npm package `babel` as it is deprecated in babel v6. (instead install `babel-cli` or `babel-core`)
In the case one of your dependencies is installing `babel` and you cannot uninstall it yourself, use the complete name of the loader in the webpack config:
```js
  {
    test: /\.js$/,
    loader: 'babel-loader',
  }
```

## [License](http://couto.mit-license.org/)
