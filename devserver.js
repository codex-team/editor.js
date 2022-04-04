/**
 * Server for static files.
 * Usage:
 *  1. run `yarn devserver:start`
 *  2. get access to files from `/example` or `/dist` on any device in local network.
 *     example: `http://{ip_address}:3000/example/example-dev.html`
 *     where {ip_address} is IP of your machine in local network.
 */
const path = require('path');
const fs = require('fs');
const http = require('http');

const port = 3000;
const host = '0.0.0.0';
const server = http.createServer(serveStatic(['/example', '/dist']));

server.listen(port, host, () => {
  console.log(`
✨ Server is running
Example page is now accessible at http://${host}:${port}/example/example-dev.html.
To open example page on any other device belonging to your local network replace 0.0.0.0 with IP address of the server machine in your local network.
You can get IP address of your machine using ipconfig/ifconfig commands. 
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
