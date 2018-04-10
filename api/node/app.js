'use strict';

const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const ensureAuthenticatedUser = require('./tokenUtils').ensureAuthenticatedUser;

// Initialize our interfact to MongoDB (mongoose) and required models
const mongoose = require('mongoose');
const User = mongoose.models.User;
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

// Add authentication to endpoints that need it
app.post("/posts", ensureAuthenticatedUser);
app.put("/posts/:id", ensureAuthenticatedUser);
app.delete("/posts/:id", ensureAuthenticatedUser);
app.post("/users", ensureAuthenticatedUser);
app.get("/users/posts", ensureAuthenticatedUser);
app.post("/notifications", ensureAuthenticatedUser);
app.delete("/notifications", ensureAuthenticatedUser);
app.delete("/notifications/:query", ensureAuthenticatedUser);
app.get("/notifications", ensureAuthenticatedUser);

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

