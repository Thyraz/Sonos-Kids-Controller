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
const dataFile = './server/config/mockdata.json'

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'www'))); // Static path to compiled Ionic app

// Models
var data;
var jsonError;
try {
    data = jsonfile.readFileSync(dataFile);
} catch (error) {
    jsonError = error.message;
    console.log(error);
}

// Routes
app.get('/api', (req, res) => {
    res.send('api works');
});

app.get('/api/data', (req, res) => {
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(500).send(jsonError);
    }
});

app.get('/api/token', (req, res) => {
    // Retrieve an access token from Spotify
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
            console.log('The Spotify access token expires in ' + data.body['expires_in']);
            console.log('The Spotify access token is ' + data.body['access_token']);

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

// Catch all other routes and return the index file from Ionic app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'www/index.html'));
});

// listen (start app with 'node server.js')
app.listen(8200);
console.log("App listening on port 8200");