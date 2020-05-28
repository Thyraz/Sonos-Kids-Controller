// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');

// Get our API routes
const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Point static path to compiled ionic app
app.use(express.static(path.join(__dirname, 'www')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'www/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));