const mongoose = require('mongoose');
const permissions = require('../permissions');

const user_perms = {
    EMAIL_VALID: 1 << 0,
    BOARD: 1 << 1,
    ADMIN: 1 << 2,
};

const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    lastname: {
        type: String,
    },
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
    permissions: {
        type: Number,
        required: true,
        default: 0,
    },
});

schema.methods.beautify = function() {
    const obj = this.toObject();
    obj.permissions = this.getPermissions();
    obj.password = undefined;
    return obj;
};

schema.methods.getPermissions = function() {
    return permissions.parse(this.permissions, user_perms);
};

schema.methods.hasPermissions = async function (...perm) {
    permissions.exists(perm, user_perms);
    return permissions.has(this.permissions, perm, user_perms);
};

schema.methods.setPermissions = async function (...perm) {
    permissions.exists(perm, user_perms);
    this.permissions = permissions.set(this.permissions, perm, user_perms);
    await this.save();
};

schema.methods.removePermissions = async function (...perm) {
    permissions.exists(perm, user_perms);
    this.permissions = permissions.remove(this.permissions, perm, user_perms);
    await this.save();
};

const db = mongoose.model('users', schema);

module.exports = db;
