const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true, 
    },
});

schema.methods.beautify = function() {
    const obj = this.toObject();
    obj.password = undefined;
    return obj;
};

const db = mongoose.model('users', schema);

module.exports = db;
