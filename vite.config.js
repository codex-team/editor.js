import path from 'path';

import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import ViteRequireContext from '@originjs/vite-plugin-require-context';
// import EnvironmentPlugin from 'vite-plugin-environment';

const pkg = require('./package.json');

process.env.VERSION = pkg.version;

/**
 * Trick to use Vite server.open option on macOS
 * @see https://github.com/facebook/create-react-app/pull/1690#issuecomment-283518768
 */
process.env.BROWSER = 'open';

export default {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src', 'codex.ts'),
      name: 'EditorJS',
      formats: [ 'umd' ],
      fileName: '[name].js',
    }
  },

  server: {
    port: 3303,
    open: true,
  },

  define: {
    // 'process.env.NODE_ENV': process.argv.mode || 'development',
    'VERSION': () => pkg.version,
  },

  plugins: [
    // EnvironmentPlugin({
    //   'NODE_ENV': process.argv.mode || 'development',
    //   'VERSION': process.env.VERSION || pkg.version,
    // }),
    ViteRequireContext(),
    cssInjectedByJsPlugin(),
  ],
};