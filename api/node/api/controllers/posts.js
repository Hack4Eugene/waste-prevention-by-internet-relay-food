/*
 * posts.js -- the controller we use to process endpoints in the /posts route
 */
'use strict';

const util = require('util');
const mongoose = require('mongoose');
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
  // Order results by descending creation date
  const find = Post.find().sort({ creationDate: -1 });
  if (limit) {
    find.limit(limit);
  }
  if (offset) {
    find.skip(offset);
  }
  find.then( function (data) {
    res.status(200).send(data);
  }).catch( function (error) {
    res.status(500).send('Unexpected error: ' + util.inspect(error));
  });
}

function search(req, res) {
  const searchParams = req.body;
  const countQuery = buildFindQuery(searchParams);
  const findQuery = buildFindQuery(searchParams);
  let count;
  countQuery.count().then( function (howMany) {
    count = howMany;
    if (searchParams.limit) {
      findQuery.limit(searchParams.limit);
    }
    if (searchParams.offset) {
      findQuery.skip(searchParams.offset);
    }
    return findQuery.exec();
  }).then( function (data) {
    const responseObj = {
      matchCount: count,
      results: data
    };
    res.status(200).send(responseObj);
  }).catch( function (error) {
    res.status(500).send('Unexpected error: ' + util.inspect(error));
  });
}

function buildFindQuery(searchParams) {
  const find = Post.find().sort({ creationDate: -1 }); // Order by descending creation date
  if (searchParams.query) {
    find.or([{"title": new RegExp(searchParams.query, 'i')}, {"description": new RegExp(searchParams.query, 'i')}]);
  }
  return find;
}

function getPost(req, res) {
  const postId = req.swagger.params.postId.value;

  if (postId == null) {
    res.status(400).send('No post ID specified');
    return;
  }

  Post.findOne({ _id: postId }).then( function(post) {
    if (!post) {
      res.status(404).send('Could not find a post with that ID');
    } else {
      res.status(200).send(post);
    }
  }).catch( function (error) {
    res.status(500).send(util.inspect(error));
  });
}

function addPost(req, res) {
  // Create the post
  const post = Post(req.body);
  // Make sure to add the email address that we received in the auth token.
  post.email = req.user.email;
  post.save().then( function (post) {
    res.status(204).end(); // No body will be sent
  }).catch( function (error) {
    res.status(500).send('Unexpected error: ' + util.inspect(error));
  });
}

function updatePost(req, res) {
  const post = Post(req.body);
  // Make sure the user is updating their own post.
  if (post.email !== req.user.email) {
    res.status(403).send('Users can only update their own posts.');
    return;
  }

  post.save().then( function (post) {
    res.status(500).send('Error updating post: ' + util.inspect(error));
  }).catch( function (error) {
    res.status(200).end(); // No body will be sent
  });
}

function deletePost(req, res) {
  const postId = req.swagger.params.postId.value;
  Post.findOne({ _id: postId }).then( function (post) {
    if (!post) {
      const error = new Error('Post not found.');
      error.class = 'not found';
      throw error;
    } else if (post.email !== req.user.email) {
      const error = new Error('Users may only delete their own posts.');
      error.class = 'permission denied';
      throw error;
    }
    // Everything looks good.  Go ahead and delete the post.
    return Post.remove({ _id: postId });
  }).then( function () {
    res.status(200).end(); // No body will be sent
  }).catch( function (error) {
    if (error.class == 'not found') {
      res.status(404).send('Post not found.');
    } else if (error.class === 'permission denied') {
      res.status(403).send('Users may only delete their own posts.');
    } else {
      res.status(500).send('Unexpected error: ' + util.inspect(error));
    }
  });
}

function validateUpload(req, res) {
  const hash = req.swagger.params.hash.value;
  if (hash == null) {
    res.status(400).send('No hash value was provided');
    return;
  }

  Photo.findOne({ hash: hash }).then( function(photo) {
    if (photo) {
      const error = new Error('A photo with that hash value already exists.');
      error.class = 'hash exists';
      throw error;
    }

    // The photo does not exist, so we need to get a signature we can use to post the track to S3
    const params = {
      Fields: {
        key: hash
      },
      Bucket: 'irf-pics',
    };

    // TODO: can we get a promise from AWS operations
    s3.createPresignedPost(params, function (error, data) {
      if (error) {
        res.status(500).send('Unexpected error: ' + util.inspect(error));
      } else {
        const formAttributes = {
          action: data.url,
          method: "POST",
          enctype: "multipart/form-data"
        };
        res.status(200).json({ formAttributes: formAttributes, formInputs: data.fields });
      }
    });
  }).catch( function (error) {
    res.status(500).send('Unexpected error: ' + util.inspect(error));
  });
}

