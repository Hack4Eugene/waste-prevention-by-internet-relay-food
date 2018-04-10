/*
 * users.js -- the controller we use to process endpoints in the /users route
 */
'use strict';

const util = require('util');
const mongoose = require('mongoose');

const User = mongoose.models.User;
const Post = mongoose.models.Post;

// Expose API endpoints
module.exports = {
  addUser: addUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getUser: getUser,
  getUserByEmail: getUserByEmail,
  getPosts: getPosts,
  getPostsByEmail: getPostsByEmail
};

// Endpoint implementations
function addUser(req, res) {
  const user = User(req.body);

  User.findOne({ email: user.email }).then( function (existing) {
    if (existing) {
      const error = new Error('There is already a user with email address ' + user.email);
      error.class = 'email exists';
      throw error;
    }
    return Promise.resolve(false);
  }).then( function () {
    // Make sure the creation date is correct
    user.created = new Date().toISOString();
    return user.save();
  }).then( function () {
    res.status(200).end(); // No body will be sent
  }).catch( function (error) {
    if (error.class === 'email exists') {
      res.status(400).send(error.message);
    } else {
      res.status(500).send('Unexpected error: ' + util.inspect(error));
    }
  });
}

function updateUser(req, res) {
  const user = User(req.body);
  // Make sure this is an update for the user's own account
  if (req.user.email !== user.email) {
    res.status(403).send('You can only modify your own user record.');
    return;
  }
  user.save().then( function (doc) {
    res.status(204).end(); // Nothing in the body
  }).catch( function (error) {
    res.status(500).send('Unexpected error: ' + util.inspect(error));
  });
}

function deleteUser(req, res) {
  let email = req.swagger.params.email.value;
  if (email == null) {
    res.status(400).send('No email specified.');
    return;
  } else if (req.user.email !== email) {
    res.status(403).send('You can only delete your own user account.');
    return;
  }

  User.findOne({ email: email }).then( function (user) {
    if (!user) {
      const error = new Error('Could not find a user with that user ID.')
      error.class = 'no such user';
      throw error;
    }
    return User.remove({ email: email });
  }).then( function() {
     res.status(204).send();
  }).catch( function (error) {
     if (error.class === 'no such user') {
       res.status(400).send('There is no user with that email address.');
     } else {
       res.status(500).send('Unexpected error: ' + util.inspect(err));
     }
  });
}

function getUser(req, res) {
  let userId = req.swagger.params.userId.value;
  if (userId == null) {
    res.status(400).send('No user ID specified.');
    return;
  }

  User.findOne({ _id: mongoose.Types.ObjectID(userId) }).then( function (user) {
    if (user == null) {
      res.status(404).send('No user with that ID exists.');
    } else {
      res.status(200).send(user);
    }
  }).catch( function (error) {
    res.status(500).send('Unexpected error: ' + util.inspect(error));
  });
}

function getUserByEmail(req, res) {
  let email = req.swagger.params.email.value;
  if (email == null) {
    res.status(400).send('No email specified.');
    return;
  }

  User.findOne({ email: email }).then( function (user) {
    if (user == null) {
      res.status(404).send('Could not find a user with that email.')
    } else {
      res.status(200).send(user);
    }
  }).catch( function (error) {
    res.status(500).send('Unexpected error: ' + util.inspect(error));
  });
}

function getPosts(req, res) {
  if (!req.user.email) {
    res.status(400).send('No email address provided in user token.');
    return;
  }
  Post.find({ email: req.user.email }).then( function(posts) {
    res.status(200).send(posts);
  }).catch( function (error) {
    res.status(500).send('Unexpected error: ' + util.inspect(error));
  });
}

function getPostsByEmail(req, res) {
  const email = req.swagger.params.email.value;
  if (!email) {
    res.status(400).send('No email address was given');
  }

  Post.find({ email: email }).then( function(posts) {
    res.status(200).send(posts);
  }).catch( function (error) {
    res.status(500).send('Unexpected error: ' + util.inspect(error));
  });
}

