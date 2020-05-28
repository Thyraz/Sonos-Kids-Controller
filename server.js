// Setup
const express = require('express');
const app = express();
const path = require('path');

// Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'www'))); // Static path to compiled Ionic app

// Models

// Routes
app.get('/api', (req, res) => {
    res.send('api works');
});

app.get('/api/data', (req, res) => {
    let mockData = [{
            id: 1,
            name: "eins"
        },
        {
            id: 2,
            name: "zwei"
        }
    ];

    res.status(200).json(mockData);
});

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'www/index.html'));
});

// listen (start app with 'node server.js')
app.listen(8080);
console.log("App listening on port 8080");