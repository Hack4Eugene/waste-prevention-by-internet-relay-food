/*
 * posts.js -- the controller we use to process endpoints in the /posts route
 */
'use strict';

const util = require('util');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Post = mongoose.models.Post;
const User = mongoose.models.User;

const AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
AWS.config.update({
  region: 'us-west-2'
});

// Set up dependencies
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: 'irf-pics'}
});

// Expose API endpoints
module.exports = {
  listPosts: listPosts,
  getPost: getPost,
  addPost: addPost,
  updatePost: updatePost,
  deletePost: deletePost,
  validateUpload: validateUpload,
  search: search
};

// Endpoint implementations
function listPosts(req, res) {
  const offset = req.swagger.params.offset.value;
  const limit = req.swagger.params.limit.value;
  const find = Post.find();
  if (limit) {
    find.limit(limit);
  }
  if (offset) {
    find.skip(offset);
  }
  find.exec().then( function (data) {
    res.status(200).json(data);
  }).catch( function (error) {
    console.log("** error: " + util.inspect(error));
    res.status(500).send("Unexpected error: " + util.inspect(error));
  });
}

function search(req, res) {
  const searchParams = req.body;
  const countQuery = buildFindQuery(searchParams);
  let count;
  //console.log("** searchParams: " + util.inspect(searchParams));
  countQuery.count().then( function (howMany) {
    count = howMany;
    const find = buildFindQuery(searchParams);
    if (searchParams.limit) {
      find.limit(searchParams.limit);
    }
    if (searchParams.offset) {
      find.skip(searchParams.offset);
    }
    return find.exec();
  }).then( function (data) {
    //console.log("** results: " + util.inspect(data));
    const responseObj = {
      matchCount: count,
      results: data
    };
    //console.log("** done");
    res.status(200).json(responseObj);
  }).catch( function (error) {
    //console.log("** error: " + util.inspect(error));
    res.status(500).send("Unexpected error: " + util.inspect(error));
  });
}

function buildFindQuery(searchParams) {
  const find = Post.find();
  if (searchParams.query) {
    find.or([{"title": new RegExp(searchParams.query, 'i')}, {"description": new RegExp(searchParams.query, 'i')}]);
  }
  return find;
}

function getPost(req, res) {
  // constiables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  const postId = req.swagger.params.postId.value;

  if (postId == null) {
    res.status(400).send('No post ID specified');
    return;
  }

  Post.findOne({ _id: postId }, function(error, post) {
        if (error) {
            console.error('Error finding post', error);
            res.status(500).send(util.inspect(error));
        } else if (!post) {
            res.status(404).send('Could not find a post with that ID');
        } else {
            res.status(200).json(post);
        }
     });
}

// Called before verification
function addPost(req, res) {
    var authHeader = req.header("Authorization");
    var email = getEmailFromToken(authHeader, req, res, authHeader, addPostVerified);
}

function getEmailFromToken(token, req, res, callback) {

  const authKey = "-----BEGIN CERTIFICATE-----\nMIIC9TCCAd2gAwIBAgIJT/D4Z70A53iZMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNVBAMTDWlyZi5hdXRoMC5jb20wHhcNMTgwNDA3MDY0MDA4WhcNMzExMjE1MDY0MDA4WjAYMRYwFAYDVQQDEw1pcmYuYXV0aDAuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwnl3R1vlP7G63vk5vTwdG7XKIJRyOtw38jkVpZ754JMhr7cxIefb6cqrhmmVA2atB90P5sQILVdfq4Jo7y+dBBGL6ZtnPSUnWWvISMCYsJi0Wbbc4HlZZMlC3hLP2isZL70RLcBJWQbuAFM5XH8nutJTjqj1KQbjxMkn5892JQMuchtjr6iTnIu00bFy/7lWm6pIWAAKICFkvntXadEQhEt6CHA9QcRLuUy2bOjgHFY+CBqFVfzlJ/kfvNISeuf8Rp0h1v7kaB2r4wGAEx5DK28EKCp3ZDeqvrHEPeHc6UA/e0Y8Oi2dfdMyphvjwLl0lKIBi8MJmelAbqzOtensiQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTDk/6ggHGnZgmQGjQpsojN2RzphDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAKmB4lF5cFNFpn8tuZEVbILvzkGwxTXy2zz8IPStrCLa8YCyjQjcsKF3kss+Oay8WbXqjEIIsc0Kzox/Z0GfbUdgThv1ADzu8DQLDmoyyBTUAErbjo9yflVKqiwY7mT7KzN6CaT6e6h9wpWKKbjPSXjRZfxR1+NGENx3/wytA3zirWhv9/hxz3hxC7d6nu75MJGkWomoYS7d8uvOQR6Lt+QMJJqlc05qMRkCPflvq4ik1CYO6GTfHZp+TYfL5tOlZBo8GzVZVqK0Dtt710d5jftzn6j8iv2pSuy/ydxzhsD8bhDMDCIgMQEJ/5DbdKK7g/ZRUuqNBCS+JWaR9dBaPAI=\n-----END CERTIFICATE-----";

 console.log("Verifying token: " + token);
 token = token.replace(/bearer /i, "");
 jwt.verify(token, authKey, { "algorithms": [ "RS256", "HS256" ], "issuer": "https://irf.auth0.com/" }, function (err, decoded) {
   if (err) {
     throw err;
     return null;
   } else {
     addPostVerified(req, res, decoded.email);
   }

 });
};

function addPostVerified(req, res, email) {
  if (email == "error") {
    return;
  }

    const post = Post(req.body);
    post.email = email;
    post.save(function (error) {
      if (error) {
        res.status(500).send('Error saving new post: ' + util.inspect(error));
      } else {
        res.status(200).end(); // No body will be sent
      }
    });
}

function updatePost(req, res) {

    const post = Post(req.body);
    post.save(function (error) {
      if (error) {
        res.status(500).send('Error updating post: ' + util.inspect(error));
      } else {
        res.status(200).end(); // No body will be sent
      }
    });

}

function deletePost(req, res) {

    const postId = req.swagger.params.postId.value;
    Post.remove({ _id: postId }, function (error) {
      if (error) {
        res.status(500).send('Error deleting post: ' + util.inspect(error));
      } else {
        res.status(200).end(); // No body will be sent
      }
    });

}

function validateUpload(req, res) {
  const hash = req.swagger.params.hash.value;
  if (hash == null) {
    res.status(400).send('No hash value was provided');
    return;
  }

  Photo.findOne({ hash: hash }, function(error, photo) {
    if (photo) {
      res.status(409).send('A photo with that hash value already exists in the database.');
    } else {
      // The photo does not exist, so we need to get a signature we can use to post the track to S3

      const params = {
        Fields: {
          key: hash
        },
        Bucket: 'irf-pics',
      };

      s3.createPresignedPost(params, function (error, data) {
        if (error) {
          console.error('Presigning post data encountered an error', error);
          res.status(500).send(util.inspect(error));
        } else {
          const formAttributes = {
            action: data.url,
            method: "POST",
            enctype: "multipart/form-data"
          };
          res.status(200).json({ formAttributes: formAttributes, formInputs: data.fields });
        }
      })

    }
  });

}

