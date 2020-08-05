// Setup
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const jsonfile = require('jsonfile');
var SpotifyWebApi = require('spotify-web-api-node');
const config = require('./server/config/config.json');

app.use(cors());

var spotifyApi = new SpotifyWebApi({
    clientId: config.spotify.clientId,
    clientSecret: config.spotify.clientSecret
});

// Configuration
const dataFile = './server/config/data.json'

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'www'))); // Static path to compiled Ionic app


// Routes
app.get('/api/data', (req, res) => {
    jsonfile.readFile(dataFile, (error, data) => {
        if (error) data = [];
        res.json(data);
    });
});

app.post('/api/add', (req, res) => {
    jsonfile.readFile(dataFile, (error, data) => {
        if (error) data = [];

        console.log(req.body);

        data.push(req.body);
        console.log(data);

        res.status(200).send();
    });
});

app.post('/api/delete', (req, res) => {
    console.log(req.body);
    res.status(200).send();
});

app.get('/api/token', (req, res) => {
    // Retrieve an access token from Spotify
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
            res.status(200).send(data.body['access_token']);
        },
        function(err) {
            console.log(
                'Something went wrong when retrieving a new Spotify access token',
                err.message
            );

            res.status(500).send(err.message);
        }
    );
});

app.get('/api/sonos', (req, res) => {
    // Send server address and port of the node-sonos-http-api instance to the client
    res.status(200).send(config['node-sonos-http-api']);
});

// Catch all other routes and return the index file from Ionic app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'www/index.html'));
});

// listen (start app with 'node server.js')
app.listen(8200);
console.log("App listening on port 8200");