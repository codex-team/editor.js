import path from 'path';

import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import license from 'rollup-plugin-license';

import * as pkg from './package.json';

const NODE_ENV = process.argv.mode || 'development';
const VERSION = pkg.version;

/**
 * Trick to use Vite server.open option on macOS
 * @see https://github.com/facebook/create-react-app/pull/1690#issuecomment-283518768
 */
process.env.BROWSER = 'open';

export default {
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src', 'codex.ts'),
      name: 'EditorJS',
      fileName: 'editorjs',
    },
    rollupOptions: {
      plugins: [
        license({
          thirdParty: {
            allow: {
              test: (dependency) => {
                // Manually allow html-janitor (https://github.com/guardian/html-janitor/blob/master/LICENSE)
                // because of missing LICENSE file in published package
                if (dependency.name === 'html-janitor') {
                  return true;
                }

                // Return false for unlicensed dependencies.
                if (!dependency.license) {
                  return false;
                }

                // Allow MIT and Apache-2.0 licenses.
                return ['MIT', 'Apache-2.0'].includes(dependency.license);
              },
              failOnUnlicensed: true,
              failOnViolation: true,
            },
            output: path.resolve(__dirname, 'dist', 'vendor.LICENSE.txt'),
          },
        }),
      ],
    },
  },

  define: {
    'NODE_ENV': JSON.stringify(NODE_ENV),
    'VERSION': JSON.stringify(VERSION),
  },

  server: {
    port: 3303,
    open: true,
  },

  plugins: [
    cssInjectedByJsPlugin(),
  ],
};
