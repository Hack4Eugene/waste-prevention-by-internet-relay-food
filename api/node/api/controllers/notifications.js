/*
 * notifications.js -- the controller we use to process endpoints in the /notifications route
 */
'use strict';

const util = require('util');
const mongoose = require('mongoose');

const Notification = mongoose.models.Notification;

// Expose API endpoints
module.exports = {
  addNotification: addNotification,
  deleteNotification: deleteNotification,
  listNotifications: listNotifications,
};

// Endpoint implementations

function addNotification(req, res) {
  var notification = Notification(req.body);
  Notification.findOne({ searchQuery: notification.searchQuery, email: notification.email }).then( function (existing) {
    if (existing) {
      throw "Search query '" + notification.searchQuery + "' already exists.";
    }
    return Promise.resolve(false);
  }).then( function (data) {
    return notification.save();
  }).then( function (data) {
    res.status(200).end(); // No body will be sent
  }).catch( function (error) {
    res.status(500).send('Error adding notification: ' + util.inspect(error));
  });
}

function deleteNotification(req, res) {
  let searchQuery = req.swagger.params.searchQuery.value;
  if (searchQuery == null) {
    res.status(400).send('No search query specified.');
    return;
  }
  let email = getEmailFromToken(req.header("Authorization"));
  if (!email) {
    res.status(400).send("Couldn't get email from token.");
    return;
  }
  Notification.findOne({ email: email, searchQuery: searchQuery })
    .exec()
    .then( function (notification) {
      if (notification == null) {
        res.status(404).send('Could not find a notification with that query.')
      } else {
        Notification.remove({ email: email, searchQuery: searchQuery }, function(err) {
          if (!err) {
            res.status(204).send();
          } else {
            res.status(500).send('Error: ' + util.inspect(err));
          }
        });
      }
    });
}

function listNotifications(req, res) {
  let email = getEmailFromToken(req.header("Authorization"));
  if (email == null) {
    res.status(400).send('Token error.');
    return;
  }

  const offset = req.swagger.params.offset.value;
  const limit = req.swagger.params.limit.value;
  const find = Notification.find({ email: email });
  if (limit) {
    find.limit(limit);
  }
  if (offset) {
    find.skip(offset);
  }
  find.exec().then( function (data) {
    res.status(200).json(data);
  }).catch( function (error) {
    res.status(500).send("Unexpected error: " + util.inspect(error));
  });
}

function getEmailFromToken(token, req, res, callback) {

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

