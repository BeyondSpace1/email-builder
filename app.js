const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Template = require('./models/Template');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Setup multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

// MongoDB Connection
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/email_builder'; // Default to local DB
mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/saveTemplate', upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const imageUrl = req.file ? `/images/${req.file.filename}` : '';

        const template = new Template({ title, content, imageUrl });
        await template.save();

        res.json({
            status: 'success',
            message: 'Template saved!',
            file: `/downloads/email_template_${Date.now()}.html`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
