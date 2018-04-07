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



global.getEmailFromToken = function (token) {
  // var token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlF6VkJSamhDUlRRNU5VVXdOekV5UkRrMk4wWTVSa05FTWpWRE5qQXhRekUwUlRGRFFrVXdNdyJ9.eyJuaWNrbmFtZSI6ImRpZW0uY2FycGUucnMiLCJuYW1lIjoiZGllbS5jYXJwZS5yc0BnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvNTQ2MzIyNTYxYTFjNGUwMWI5NjQ3Mzc0Njk2OWYyMzA_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZkaS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAxOC0wNC0wN1QxOTo0MDoxNy44MzBaIiwiZW1haWwiOiJkaWVtLmNhcnBlLnJzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2lyZi5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWFjODY4OTM0M2M4N2YxMTQ5ZWY4MjJlIiwiYXVkIjoibmFHS1pUb3NHMk5wNzdIWExXbnRYVmNZMTAxMGVURlkiLCJpYXQiOjE1MjMxMzAwMTksImV4cCI6MTUyMzE2NjAxOX0.r7YwuP3_LyWtokR-gVGPrWrsBXLpc_tp0f75jg9MVX6EmK_gWJMSO7U48THHlgkAs6eBGJ5o66c6gEKyaO5XU-Mccs5FeBXMEzdSVeT0NswYesZHtAZRWhfIPhxATTj2TnQnk490UIZwH6WdYsbpfOJItf1nTbYYzrukPlalyzjCvmFFym5FbwdV1E7gSWwIqdl2EYYp1TD5HCah7MKSaKzrmBvCVS5bJ5kQDYvEtTTFqzr1KpbnjIece4sV-nkaPWLvJGK9PVhGHtKkF-xk0xHxKZhYhxafGKo7DPURf4XPdrZhNzLYTD9Opc4-VWrLBJxPrVqeCSbtZWwyaus72g`
  var t = jwt.decode(token)
  console.log("returning:", t.email)
  return t.email
};


global.getUserIdFromEmail = function (email){
  user = User.findOne({email : email});
  return user.userId;
};


