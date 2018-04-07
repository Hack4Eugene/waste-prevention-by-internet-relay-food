'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const jwt = require("jsonwebtoken");
module.exports = app; // for testing

const mongoose = require('mongoose');
const User = mongoose.models.User;
// Preload models so they can be read via mongoose downstream.
// Note that the order is important.  Some models depend on other models.
require('./api/models/user');
require('./api/models/post');
require('./api/models/notification');

mongoose.connect('mongodb://localhost/irf');

// serve up swagger docs
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api/swagger/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10100;
  app.listen(port);

});

global.getEmailFromToken = function(token, res, authHeader) {
  if (!authHeader) {
   res.status(403).send('No authorization header received');
   return "error";
 }
  var parts = authHeader.split(" ");
  if (parts.length < 2) {
   res.status(403).send('Invalid authorization header');
   return "error";
  }
  var token = parts[1];
  console.log("Auth Token: " + token);
  jwt.verify(token, authKey, { "algorithms": [ "HS256" ], "issuer": "https://irf.auth0.com/"}, function (err, decoded) {
   if (err) {
     res.status(403).send('Error processing token: ' + util.inspect(err));
     return "error";
   }
  })
  var t = jwt.decode(token)
  console.log("returning:", t.email)
  return t.email

};

global.getUserIdFromEmail = function (email){
  var user = User.findOne({email : email});
  return user.userId;
};
