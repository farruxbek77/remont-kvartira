const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Load data from file
let requests = [];
if (fs.existsSync(DATA_FILE)) {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        requests = JSON.parse(data);
    } catch (err) {
        console.error('Error loading data:', err);
        requests = [];
    }
}

// Save data to file
function saveData() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2));
    } catch (err) {
        console.error('Error saving data:', err);
    }
}

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

// API Routes
app.get('/api/requests', (req, res) => {
    res.json(requests);
});

app.post('/api/requests', upload.single('image'), (req, res) => {
    try {
        const newRequest = {
            id: Date.now(),
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            description: req.body.description,
            image: req.file ? `/uploads/${req.file.filename}` : null,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        requests.push(newRequest);
        saveData();
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
        saveData();
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
        saveData();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/client', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
