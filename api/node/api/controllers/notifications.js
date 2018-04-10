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
  if (notification.email !== req.user.email) {
    res.status(403).send('Users can only submit notifications for themselves.');
    return;
  }
  Notification.findOne({ searchQuery: notification.searchQuery, email: notification.email }).then( function (existing) {
    if (existing) {
      const error = new Error("Search query '" + notification.searchQuery + "' already exists.");
      error.class = 'exists';
      throw error;  
    }
    return Promise.resolve(false);
  }).then( function (data) {
    return notification.save();
  }).then( function (data) {
    res.status(200).end(); // No body will be sent
  }).catch( function (error) {
    if (error.class === 'exists') {
      res.status(400).send(error.message);
    } else {
      res.status(500).send('Unexpected error: ' + util.inspect(error));
    }
  });
}

function deleteNotification(req, res) {
  let searchQuery = req.swagger.params.searchQuery.value;
  if (searchQuery == null) {
    res.status(400).send('No search query specified.');
    return;
  }
  Notification.findOne({ email: req.user.email, searchQuery: searchQuery }).then( function (notification) {
    if (notification == null) {
      const error = new Error('Could not find a notification with that query.');
      error.class = 'not found';
      throw error;
    }
    return Notification.remove({ email: email, searchQuery: searchQuery });
  }).then( function() {
    res.status(204).send();
  }).catch( function (error) {
    if (error.class === 'not found') {
      res.status(404).send(error.message);
    } else {
      res.status(500).send('Error: ' + util.inspect(err));
    }
  });
}

function deleteAllNotifications(req, res) {
  Notification.remove({ email: req.user.email }).then( function() {
    res.status(204).end(); // No body
  }).catch( function (error) {
    res.status(500).send('Unexpected error: ' + util.inspect(error));
  });
}

function listNotifications(req, res) {
  const offset = req.swagger.params.offset.value;
  const limit = req.swagger.params.limit.value;
  const find = Notification.find({ email: req.user.email });
  if (limit) {
    find.limit(limit);
  }
  if (offset) {
    find.skip(offset);
  }
  find.then( function (data) {
    res.status(200).json(data);
  }).catch( function (error) {
    res.status(500).send("Unexpected error: " + util.inspect(error));
  });
}

