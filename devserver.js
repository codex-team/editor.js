/**
 * Server for static files.
 * Usage:
 *  1. run `yarn devserver:start`
 *  2. get access to files from `/example` or `/dist` on any device in local network.
 *     example: `http://{ip_address}:3000/example/example-dev.html`
 *     where {ip_address} is IP of your machine.
 */
const path = require('path');
const fs = require('fs');
const http = require('http');
const { networkInterfaces } = require('os');

const port = 3000;
const localhost = '0.0.0.0';
const host = getHost()
const server = http.createServer(serveStatic(['/example', '/dist']));

server.listen(port, localhost, () => {
  console.log(`
✨ Server is running
Example page is now accessible at http://${host}:${port}/example/example-dev.html.
Page can be opened from any device connected to the same local network.
`);
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
 * Returns IP address of machine
 * @returns {string}
 */
function getHost() {
  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object

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

return results['en0'][0]
}