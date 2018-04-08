/*
 * users.js -- the controller we use to process endpoints in the /users route
 */
'use strict';

const util = require('util');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.models.User;
const Post = mongoose.models.Post;

// Set up the autoincrement for trackID
// Expose API endpoints
module.exports = {
  addUser: addUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getUser: getUser,
  getUserByEmail: getUserByEmail,
  getPosts: getPosts
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

function getPosts(req, res) {
  let email = getEmailFromToken(req.header("Authorization"));
  if (!email) {
    res.status(403).send("Authentication required");
    return;
  }
  Post.find({ email: email }, function(err, posts) {
    if (err) {
      res.status(500).send("Error: " + util.inspect(err));
    } else {
      res.status(200).send(posts);
    }
  });
}

function getEmailFromToken(token) {

  const authKey = "-----BEGIN CERTIFICATE-----\nMIIC9TCCAd2gAwIBAgIJT/D4Z70A53iZMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNVBAMTDWlyZi5hdXRoMC5jb20wHhcNMTgwNDA3MDY0MDA4WhcNMzExMjE1MDY0MDA4WjAYMRYwFAYDVQQDEw1pcmYuYXV0aDAuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwnl3R1vlP7G63vk5vTwdG7XKIJRyOtw38jkVpZ754JMhr7cxIefb6cqrhmmVA2atB90P5sQILVdfq4Jo7y+dBBGL6ZtnPSUnWWvISMCYsJi0Wbbc4HlZZMlC3hLP2isZL70RLcBJWQbuAFM5XH8nutJTjqj1KQbjxMkn5892JQMuchtjr6iTnIu00bFy/7lWm6pIWAAKICFkvntXadEQhEt6CHA9QcRLuUy2bOjgHFY+CBqFVfzlJ/kfvNISeuf8Rp0h1v7kaB2r4wGAEx5DK28EKCp3ZDeqvrHEPeHc6UA/e0Y8Oi2dfdMyphvjwLl0lKIBi8MJmelAbqzOtensiQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTDk/6ggHGnZgmQGjQpsojN2RzphDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAKmB4lF5cFNFpn8tuZEVbILvzkGwxTXy2zz8IPStrCLa8YCyjQjcsKF3kss+Oay8WbXqjEIIsc0Kzox/Z0GfbUdgThv1ADzu8DQLDmoyyBTUAErbjo9yflVKqiwY7mT7KzN6CaT6e6h9wpWKKbjPSXjRZfxR1+NGENx3/wytA3zirWhv9/hxz3hxC7d6nu75MJGkWomoYS7d8uvOQR6Lt+QMJJqlc05qMRkCPflvq4ik1CYO6GTfHZp+TYfL5tOlZBo8GzVZVqK0Dtt710d5jftzn6j8iv2pSuy/ydxzhsD8bhDMDCIgMQEJ/5DbdKK7g/ZRUuqNBCS+JWaR9dBaPAI=\n-----END CERTIFICATE-----";

 console.log("Verifying token: " + token);
 token = token.replace(/bearer /i, "");
 const decoded = jwt.verify(token, authKey, { "algorithms": [ "RS256", "HS256" ], "issuer": "https://irf.auth0.com/" });
 if (decoded) {
   return decoded.email;
 } else {
   return null;
 }
};

