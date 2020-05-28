const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});

// Get all data
router.get('/data', (req, res) => {
    // Get data from the mock api
    axios.get(`${API}/posts`)
        .then(mockData => {
            res.status(200).json(mockData.data);
        })
        .catch(error => {
            res.status(500).send(error)
        });
});

module.exports = router;