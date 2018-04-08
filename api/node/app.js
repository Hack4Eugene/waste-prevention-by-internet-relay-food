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

// Always send CORS headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Cache-Control", "no-cache");
  next();
});

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

