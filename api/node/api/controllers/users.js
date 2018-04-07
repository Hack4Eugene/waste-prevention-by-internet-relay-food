/*
 * users.js -- the controller we use to process endpoints in the /users route
 */
'use strict';

const util = require('util');
const mongoose = require('mongoose');

const User = mongoose.models.User;

// Set up the autoincrement for trackID
// Expose API endpoints
module.exports = {
  addUser: addUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getUser: getUser,
  getUserByEmail: getUserByEmail
};

// Endpoint implementations

function addUser(req, res) {
  const user = User(req.body);
  // Make sure the username is unique
  User.findOne({ username: user.username}).then( function (existing) {
    if (existing) {
      throw "Username '" + user.username + "' is taken.";
    }
    return Promise.resolve(false);
  }).then( function (encryptedPassword) {
    return user.save();
  }).then( function (data) {
    res.status(200).end(); // No body will be sent
  }).catch( function (error) {
    res.status(500).send('Error adding user: ' + util.inspect(error));
  });
}

function updateUser(req, res) {
  // TODO: Permission check
  // TODO: validation?
  const user = User(req.body);
}

function deleteUser(req, res) {
  // TODO: Persmissions check
  let userId = req.swagger.params.userId.value;
  if (userId == null) {
    res.status(400).send('No user ID specified.');
    return;
  }
  User.findOne({ _id: mongoose.Types.ObjectID(userId) })
    .exec()
    .then( function (user) {
      if (user == null) {
        res.status(404).send('Could not find a user with that user ID.')
      } else {
        User.remove({ _id: mongoose.Types.ObjectID(userId) }, function(err) {
          if (!err) {
            res.status(204).send();
          } else {
            res.status(500).send('Error: ' + util.inspect(err));
          }
        });
      }
    });
}

function getUser(req, res) {
  let userId = req.swagger.params.userId.value;
  if (userId == null) {
    res.status(400).send('No user ID specified.');
    return;
  }

  User.findOne({ _id: mongoose.Types.ObjectID(userId) })
    .exec()
    .then( function (user) {
      if (user == null) {
        res.status(404).send('Could not find a user with that user ID.')
      } else {
        res.status(200).json(user);
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

  User.findOne({ email: email })
    .exec()
    .then( function (user) {
      if (user == null) {
        res.status(404).send('Could not find a user with that email.')
      } else {
        res.status(200).json(user);
      }
    }).catch( function (error) {
      res.status(500).send('Unexpected error: ' + util.inspect(error));
    });
}

