const jwt = require('jsonwebtoken');

const pubKeyForAuth = "-----BEGIN CERTIFICATE-----\nMIIC9TCCAd2gAwIBAgIJT/D4Z70A53iZMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNVBAMTDWlyZi5hdXRoMC5jb20wHhcNMTgwNDA3MDY0MDAFWhcNMzExMjE1MDY0MDA4WjAYMRYwFAYDVQQDEw1pcmYuYXV0aDAuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwnl3R1vlP7G63vk5vTwdG7XKIJRyOtw38jkVpZ754JMhr7cxIefb6cqrhmmVA2atB90P5sQILVdfq4Jo7y+dBBGL6ZtnPSUnWWvISMCYsJi0Wbbc4HlZZMlC3hLP2isZL70RLcBJWQbuAFM5XH8nutJTjqj1KQbjxMkn5892JQMuchtjr6iTnIu00bFy/7lWm6pIWAAKICFkvntXadEQhEt6CHA9QcRLuUy2bOjgHFY+CBqFVfzlJ/kfvNISeuf8Rp0h1v7kaB2r4wGAEx5DK28EKCp3ZDeqvrHEPeHc6UA/e0Y8Oi2dfdMyphvjwLl0lKIBi8MJmelAbqzOtensiQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTDk/6ggHGnZgmQGjQpsojN2RzphDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAKmB4lF5cFNFpn8tuZEVbILvzkGwxTXy2zz8IPStrCLa8YCyjQjcsKF3kss+Oay8WbXqjEIIsc0Kzox/Z0GfbUdgThv1ADzu8DQLDmoyyBTUAErbjo9yflVKqiwY7mT7KzN6CaT6e6h9wpWKKbjPSXjRZfxR1+NGENx3/wytA3zirWhv9/hxz3hxC7d6nu75MJGkWomoYS7d8uvOQR6Lt+QMJJqlc05qMRkCPflvq4ik1CYO6GTfHZp+TYfL5tOlZBo8GzVZVqK0Dtt710d5jftzn6j8iv2pSuy/ydxzhsD8bhDMDCIgMQEJ/5DbdKK7g/ZRUuqNBCS+JWaR9dBaPAI=\n-----END CERTIFICATE-----";

// This function only decodes the token
function decodeToken(tokenText) {
  // Strip the 'bearer' part of the header if it's still there
  tokenText = tokenText.replace(/bearer /i, "");
  // decode and check the signature using the public key
  return jwt.verify(tokenText, pubKeyForAuth, { "algorithms": [ "RS256", "HS256" ], "issuer": "https://irf.auth0.com/" });
}

// This function pulls the Authorization header from the request and makes sure we have a valid authenticated user.
// If anything goes wrong we respond to the request with an appropriate error
function ensureAuthenticatedUser(req, res, next) {

  const authHeader = req.header("Authorization");
  if (!authHeader) {
    res.status(403).send('An authentication token is required.  Please make sure to include one in the Authorization HTTP header.');
    return;
  }

  try { req.user = decodeToken(authHeader); }
  catch (err) {
    res.status(403).send('Could not verify user token: ' + err); 
    return;
  }

  // If all went well, move on to the next step.
  next();

}

// Make functions available to code that imports this module
exports.ensureAuthenticatedUser = ensureAuthenticatedUser;
exports.decodeToken = decodeToken;

