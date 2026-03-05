const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/remont-service';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Request Schema
const requestSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    description: String,
    image: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Request = mongoose.model('Request', requestSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if not exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// In-memory database
let requests = [];
let requestIdCounter = 1;

// API Routes
app.get('/api/requests', (req, res) => {
    res.json(requests);
});

app.post('/api/requests', upload.single('image'), (req, res) => {
    try {
        const newRequest = {
            id: requestIdCounter++,
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            description: req.body.description,
            image: req.file ? `/uploads/${req.file.filename}` : null,
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
    const id = parseInt(req.params.id);
    const request = requests.find(r => r.id === id);

    if (!request) {
        return res.status(404).json({ success: false, error: 'Request not found' });
    }

    request.status = req.body.status;
    res.json({ success: true, request });
});

app.delete('/api/requests/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = requests.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ success: false, error: 'Request not found' });
    }

    requests.splice(index, 1);
    res.json({ success: true });
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/client', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
