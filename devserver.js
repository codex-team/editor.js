/**
 * Server for testing example page on mobile devices.
 *
 * Usage:
 *  1. run `yarn devserver:start`
 *  2. Open `http://{ip_address}:3000/example/example-dev.html`
 *     where {ip_address} is IP of your machine.
 *
 *  Also, can serve static files from `/example` or `/dist` on any device in local network.
 */
const path = require('path');
const fs = require('fs');
const http = require('http');
const { networkInterfaces } = require('os');

const port = 3000;
const localhost = '127.0.0.1';
const nonRoutableAddress = '0.0.0.0';
const host = getHost();
const server = http.createServer(serveStatic([
  '/example',
  '/dist',
]));

server.listen(port, nonRoutableAddress, () => {
  console.log(`

${wrapInColor('Editor.js 💖', consoleColors.hiColor)} devserver is running ᕕ(⌐■_■)ᕗ ✨
---------------------------------------------
${wrapInColor('http://' + host + ':' + port + '/example/example-dev.html', consoleColors.fgGreen)}
---------------------------------------------
Page can be opened from any device connected to the same local network.
`);

  if (host === localhost) {
    console.log(wrapInColor('Looks like you are not connected to any Network so you couldn\'t debug the Editor on your mobile device at the moment.', consoleColors.fgRed));
  }
});

/**
 * Serves files from specified directories
 *
 * @param {string[]} paths - directories files from which should be served
 * @returns {Function}
 */
function serveStatic(paths) {
  return (request, response) => {
    const resource = request.url;
    const isPathAllowed = paths.find(p => resource.startsWith(p));

    if (!isPathAllowed) {
      response.writeHead(404);
      response.end();

      return;
    }
    const filePath = path.join(__dirname, resource);

    try {
      const stat = fs.statSync(filePath);

      response.writeHead(200, {
        'Content-Length': stat.size,
      });
      const readStream = fs.createReadStream(filePath);

      readStream.on('error', e => {
        throw e;
      });
      readStream.pipe(response);
    } catch (e) {
      response.writeHead(500);
      response.end(e.toString());
    }
  };
}

/**
 * Returns IP address of a machine
 *
 * @returns {string}
 */
function getHost() {
  const nets = networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  /**
   * Offline case
   */
  if (Object.keys(results).length === 0) {
    return localhost;
  }

  return results['en0'][0];
}

/**
 * Terminal output colors
 */
const consoleColors = {
  fgMagenta: 35,
  fgRed: 31,
  fgGreen: 32,
  hiColor: 1,
};

/**
 * Set a terminal color to the message
 *
 * @param {string} msg - text to wrap
 * @param {string} color - color
 * @returns {string}
 */
function wrapInColor(msg, color) {
  return '\x1b[' + color + 'm' + msg + '\x1b[0m';
}
