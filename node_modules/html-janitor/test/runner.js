var specs = Object.keys(window.__karma__.files).filter(function (file) {
  return (/\.spec\.js$/).test(file);
});

require.config({
  baseUrl: '/base/src',

  // ask Require.js to load these files (all our tests)
  deps: specs,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});
