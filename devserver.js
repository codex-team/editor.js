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
  console.log(`Server is running on http://${host}:${port}`);
});

/**
 * Serves files from specified directories
 *
 * @param {string[]} paths - directories files from which should be served
 * @returns {void}
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

// const express = require('express');
// const path = require('path');
// const app = express();
// const port = 3000;

// app.use('/dist', express.static(path.resolve(__dirname, 'dist')));
// app.use(express.static(path.resolve(__dirname, 'example')));

// app.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });