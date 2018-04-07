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

global.getEmailFromToken = function(token) {
  const authKey = "MIIC9TCCAd2gAwIBAgIJT/D4Z70A53iZMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNVBAMTDWlyZi5hdXRoMC5jb20wHhcNMTgwNDA3MDY0MDA4WhcNMzExMjE1MDY0MDA4WjAYMRYwFAYDVQQDEw1pcmYuYXV0aDAuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwnl3R1vlP7G63vk5vTwdG7XKIJRyOtw38jkVpZ754JMhr7cxIefb6cqrhmmVA2atB90P5sQILVdfq4Jo7y+dBBGL6ZtnPSUnWWvISMCYsJi0Wbbc4HlZZMlC3hLP2isZL70RLcBJWQbuAFM5XH8nutJTjqj1KQbjxMkn5892JQMuchtjr6iTnIu00bFy/7lWm6pIWAAKICFkvntXadEQhEt6CHA9QcRLuUy2bOjgHFY+CBqFVfzlJ/kfvNISeuf8Rp0h1v7kaB2r4wGAEx5DK28EKCp3ZDeqvrHEPeHc6UA/e0Y8Oi2dfdMyphvjwLl0lKIBi8MJmelAbqzOtensiQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTDk/6ggHGnZgmQGjQpsojN2RzphDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAKmB4lF5cFNFpn8tuZEVbILvzkGwxTXy2zz8IPStrCLa8YCyjQjcsKF3kss+Oay8WbXqjEIIsc0Kzox/Z0GfbUdgThv1ADzu8DQLDmoyyBTUAErbjo9yflVKqiwY7mT7KzN6CaT6e6h9wpWKKbjPSXjRZfxR1+NGENx3/wytA3zirWhv9/hxz3hxC7d6nu75MJGkWomoYS7d8uvOQR6Lt+QMJJqlc05qMRkCPflvq4ik1CYO6GTfHZp+TYfL5tOlZBo8GzVZVqK0Dtt710d5jftzn6j8iv2pSuy/ydxzhsD8bhDMDCIgMQEJ/5DbdKK7g/ZRUuqNBCS+JWaR9dBaPAI=";
  jwt.verify(token, authKey, { "algorithms": [ "HS256" ], "issuer": "https://irf.auth0.com/"}, function (err, decoded) {
   if (err) {
     //res.status(403).send('Error processing token: ' + util.inspect(err));
     return "error";
   }
  })
  //var t = jwt.decode(token)
  //console.log("returning:", t.email)
  return decoded.email;

};

global.getUserIdFromEmail = function (email){
  var user = User.findOne({email : email});
  return user.userId;
};
