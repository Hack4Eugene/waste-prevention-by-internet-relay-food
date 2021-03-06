const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title:  String,
  email: String,
  creationDate: Date,
  status: String,
  eligibility: [String],
  amount: String,
  readiness: String,
  description: String,
  pickupWindow: String,
  pickupAddress: String
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
