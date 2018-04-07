const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    role: String,
    created: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;
