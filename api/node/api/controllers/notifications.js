/*
 * notifications.js -- the controller we use to process endpoints in the /notifications route
 */
'use strict';

const util = require('util');
const mongoose = require('mongoose');

const Search = mongoose.models.Search;

// Set up the autoincrement for trackID
// Expose API endpoints
module.exports = {
  addNotification: addNotification,
  deleteNotification: deleteNotification,
  listNotifications: listNotifications,
};

// Endpoint implementations

function addNotification(req, res) {
  userId = "5ac8ae15982abe65368ca658"
  
  const notification = Notification(req.body);
  Notification.findOne({ searchQuery: notification.searchQuery, userId: notification.userId }).then( function (existing) {
    if (existing) {
      throw "Search query '" + notification.searchQuery + "' already exists.";
    }
    return Promise.resolve(false);
  }).then( function (data) {
    return user.save();
  }).then( function (data) {
    res.status(200).end(); // No body will be sent
  }).catch( function (error) {
    res.status(500).send('Error adding notification: ' + util.inspect(error));
  });
}

function deleteNotification(req, res) {
  // TODO: We need to look up the user from the auth token
  userId = "5ac8ae15982abe65368ca658"



  let searchQuery = req.swagger.params.searchQuery.value;
  if (searchQuery == null) {
    res.status(400).send('No search query specified.');
    return;
  }
  Notification.findOne({ userId: mongoose.Types.ObjectID(userId), searchQuery: searchQuery })
    .exec()
    .then( function (notification) {
      if (notification == null) {
        res.status(404).send('Could not find a notification with that query.')
      } else {
        Notification.remove({ _id: mongoose.Types.ObjectID(notification._id) }, function(err) {
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
  // TODO: Get user email from the auth token, look up the user so we can get the ID
  userId = "5ac8ae15982abe65368ca658"


  if (userId == null) {
    res.status(400).send('No user ID specified.');
    return;
  }

  const offset = req.swagger.params.offset.value;
  const limit = req.swagger.params.limit.value;
  const find = Notification.find({ userId: userId });
  if (limit) {
    find.limit(limit);
  }
  if (offset) {
    find.skip(offset);
  }
  find.exec().then( function (data) {
    console.log("** results: " + util.inspect(data));
    res.status(200).json(data);
  }).catch( function (error) {
    console.log("** error: " + util.inspect(error));
    res.status(500).send("Unexpected error: " + util.inspect(error));
  });
}

function getEmailFromToken(token) {
  // TODO: Add real token support
  return "example@example.com"
}
