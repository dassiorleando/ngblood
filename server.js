// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
// Get our API routes
const api = require('./server/routes/api');
const app = express();
/**
 * Create HTTP server.
 */
const server = http.createServer(app);
// Socket.io for real time communication
var io = require('socket.io').listen(server);


// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));

/**
 * Socket events
 */
io.sockets.on('connection', function(socket){
  console.log('Socket connected');
  // Socket event for blood shared
  socket.on('bloodSaved', function(pointSaved){
    io.emit('bloodSaved', pointSaved);
  });

  // Socket event for blood updated
  socket.on('bloodUpdated', function(pointUpdated){
    io.emit('bloodUpdated', pointUpdated);
  });
});
