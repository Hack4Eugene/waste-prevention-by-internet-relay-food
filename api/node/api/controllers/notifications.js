/*
 * notifications.js -- the controller we use to process endpoints in the /notifications route
 */
'use strict';

const util = require('util');
const mongoose = require('mongoose');

const Notification = mongoose.models.Notification;

// Set up the autoincrement for trackID
// Expose API endpoints
module.exports = {
  addNotification: addNotification,
  deleteNotification: deleteNotification,
  listNotifications: listNotifications,
};

// Endpoint implementations
function getUserId(req){
  var header = req.header("authorization");
  var token = header.split(" ")[1];
  var email = global.getEmailFromToken(token);
  var userId = global.getUserIdFromEmail(email);
  return userId;
}

function addNotification(req, res) {
  var userId = getUserId(req);
  var notification = Notification(req.body);
  notification.userId = userId;
  console.log(util.inspect(req.body));
  console.log(util.inspect(notification));
  Notification.findOne({ searchQuery: notification.searchQuery, userId: userId }).then( function (existing) {
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
  var userId = getUserId(req);
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
  var userId = getUserId(req);
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
