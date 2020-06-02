// Setup
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const jsonfile = require('jsonfile')

app.use(cors());

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

// Catch all other routes and return the index file from Ionic app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'www/index.html'));
});

// listen (start app with 'node server.js')
app.listen(8200);
console.log("App listening on port 8200");