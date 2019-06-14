/**
 * Static HTTP Server
 *
 * Create a static file server instance to serve files
 * and folder in the './public' folder
 */

// modules
var static = require( 'node-static' ),
  port = 5000,
  http = require( 'http' );

// config
var file = new static.Server( './', {
  cache: false,
  gzip: true
} );

// serve
var server = http.createServer( function ( request, response ) {
  request.addListener( 'end', function () {
    console.log('New request handled');
    file.serve( request, response );
  } ).resume();
} ).listen( port );

server.on('listening', function () {
  console.log('Server is listening ' + port + '...');
});

server.on('error', function (error) {
  console.log('Failed to run server', error);
});
