const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    project: {
        type: String,
        required: true,
    },
    meta: {
        type: Object,
    },
});

const db = mongoose.model('signatures', schema);

module.exports = db;
