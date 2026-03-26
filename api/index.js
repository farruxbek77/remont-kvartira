const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory data storage
let requests = [];

// API Routes
app.get('/api/requests', (req, res) => {
    res.json(requests);
});

app.post('/api/requests', (req, res) => {
    try {
        const newRequest = {
            id: Date.now(),
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            description: req.body.description,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        requests.push(newRequest);
        res.json({ success: true, request: newRequest });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/requests/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const request = requests.find(r => r.id === id);

        if (!request) {
            return res.status(404).json({ success: false, error: 'Request not found' });
        }

        request.status = req.body.status;
        res.json({ success: true, request });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/requests/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = requests.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Request not found' });
        }

        requests.splice(index, 1);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = app;
