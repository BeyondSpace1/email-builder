const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
});

const template = mongoose.model('template', templateSchema);

module.exports = template;
