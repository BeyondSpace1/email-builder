const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
});

const Template = mongoose.model('Template', TemplateSchema);

module.exports = Template;
