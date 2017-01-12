/*
 * This example targets Node 4 and up.
 */

const cssnano = require('cssnano');

/*
 * Add your CSS code here.
 */

const css = `
h1 {
    color: #ff0000;
    font-weight: bold;
}
`;

/*
 * Add your configuration here; see http://cssnano.co/options/ and
 * http://cssnano.co/optimisations/ for more details.
 *
 * For example you can turn off z-index rebasing by setting `zindex: false`
 * in your config, or you can use `safe: true` which will turn off unsafe
 * optimisations.
 */

const opts = {

};

/*
 * Compress the CSS asynchronously and log it to the console.
 */

cssnano.process(css, opts).then(result => {
    console.log(result.css);
});
