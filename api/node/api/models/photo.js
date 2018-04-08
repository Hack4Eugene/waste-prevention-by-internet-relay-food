const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const photoSchema = new Schema({
    postId: mongoose.Schema.ObjectId,
    hash: String,
    url: String
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;

