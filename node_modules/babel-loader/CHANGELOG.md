# Changelog

## v6.2.9

### 😢 Regression

Source maps on windows did not work correctly with v6.2.8.
Thanks @josephst

### 🏠 Internal

- Add AppVeyor to run tests on windows @danez
- Fix tests on windows (#343) @danez

## v6.2.8

### 🐛 Bug Fix

- gzipped files should have `.gz` as the extension, not `.gzip` (#326) @bjornstar
- fix options.sourceFileName gennerate bug (#260) @creeperyang

### 📝 Documentation

- Update README docs for cacheDirectory's actual behaviour (#245) @sohkai
- updates docs re: transform-runtime (#197) @gbrassey

### 🏠 Internal

- Use eslint and nyc (#321) @danez
- Adjust travis config (#320) @danez
- Use babel to compile babel-loader (#319) @danez

## v6.2.7

### 😢 Regression

Fallback to `os.tmpdir()` if no cachedir found (#318) (fixes #317) @danez

Fixes an issue with v6.2.6 when using `babel-loader` as a global package.

## v6.2.6

### 🐛 Bug Fix

- Use standard cache dir as default `cacheDirectory` (#301) @fson

Use the common cache directory, `./node_modules/.cache/babel-loader`, as the default cache directory (when the cacheDirectory setting is enabled).

```js
query: {
  cacheDirectory: true
}
```

## v6.2.5

- Don't show the call stack for a Babel error (such as when you have a syntax error)

<img width="415" alt="screenshot 2016-08-15 15 24 37" src="https://cloud.githubusercontent.com/assets/30594/17664401/727ba098-62fc-11e6-9f12-42da0cf47f14.png">

- resolve the .babelrc relative to the file path rather than the cwd (current working directory).

 * fix: more concise formatting for Babel errors (#287) (Andrey Popp)
 * fix(resolve-rc): resolve-rc relative file path (#253) (Luke Page)
 * add babel-core and preset-2015 to dev dependencies (#273) (timse)
 * chore(docs): add issue and pr templates (#280) (Joshua Wiens)
 * chore(docs): fix badge formatting (Joshua Wiens)
 * chore(ci): expand travis testing (#278) (Joshua Wiens)
 * Update README: add env vars to cacheIdentifier (#267) (Dominik Ferber)
 * add npm badge [skip ci] (Henry Zhu)
 * update [skip ci] (Henry Zhu)
 * remove jsx references as well [skip ci] (Henry Zhu)
 * Save the transform to devDependencies (Ray Booysen)
 * Remove 'react' preset (Jake Rios)
 * Removed babel-preset-react from README.md (Ben Stephenson)

## v6.2.4
 * change allowed peer deps (all webpack 2 beta versions)

## v6.2.3
 * change allowed peer deps (2.0.7-beta)

## v6.2.2
  * Update peerDependencies to accept webpack 2 [#208](https://github.com/babel/babel-loader/pull/208)
  * Remove duplicated dependencies

## v6.2.0
  * Pass true filenames [#106](https://github.com/babel/babel-loader/issues/106)
  * Remove babel-core from devDependencies

## v6.1.0

  * Merge [PR #146](https://github.com/babel/babel-loader/pull/146) Set source file name relative to options.sourceRoot
  * Merge [PR #136](https://github.com/babel/babel-loader/pull/136) use container-based infrastructure for faster build
  * Merge [PR #121](https://github.com/babel/babel-loader/pull/121) Make babelrc configurable
  * Merge [PR #113](https://github.com/babel/babel-loader/pull/113) Include BABEL_ENV || NODE_ENV in cacheIdentifier

## v6.0.1

  * Update to babel v6.

## v5.3.1

  * Merge [PR #85](https://github.com/babel/babel-loader/pull/85) - Don't override sourcemap if sourcesContent already exists.


## v5.3.1

  * Merge [PR #82](https://github.com/babel/babel-loader/pull/82) - Fallback global options to empty object to avoid conflicts with object-assign polyfill.

## v5.3.0

  * Merge [PR #79](https://github.com/babel/babel-loader/pull/79) - This should allow babel-loader to work with [enhanced-require](https://github.com/webpack/enhanced-require).

## v5.2.0

  * Include `.babelrc` file into the `cacheIdentifier` if it exists
