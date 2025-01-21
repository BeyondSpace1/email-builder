const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const template = require('./models/template');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Ensure public/images directory exists
const uploadDir = './public/images';
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
        }
        cb(null, true);
    }
});

// MongoDB Connection
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/email_builder';
mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/saveTemplate', upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ status: 'error', message: 'Title and content are required.' });
        }

        const imageUrl = req.file ? `/images/${req.file.filename}` : '';
        const newTemplate = new template({ title, content, imageUrl });
        await newTemplate.save();

        res.json({
            status: 'success',
            message: 'Template saved!',
            file: `/downloads/email_template_${Date.now()}.html`,
        });
    } catch (error) {
        console.error('Error saving template:', error.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message.includes('Invalid file type')) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
    next(err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
