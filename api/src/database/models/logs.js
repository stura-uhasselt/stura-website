const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['INFO', 'ERROR', 'MAIL'],
        default: 'INFO',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    message: {
        type: String,
    },
    meta: {
        type: Object,
    },
});

const db = mongoose.model('logs', schema);

module.exports = db;
