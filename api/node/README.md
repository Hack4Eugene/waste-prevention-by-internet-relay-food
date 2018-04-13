# Operation Food Rescue API

This directory contains the node.js implementation of the Operation Food Rescue REST API.
The API is used by client applications to create food-sharing posts and facilitate communication
between interested parties.

The API is a node.js application built with the swagger-node-mw module.  This means that the
API definition is driven entirely by its OpenAPI 2.0 spec (aka the 
'[swagger file](api/swagger/swagger.yaml)').  In order to add new endpoints you'll need to
add them to the spec and mark their controller file with the `x-swagger-router-controller`
attribute and the function that handles the endpoint with `operationId` attribute. 

The API expects to interact with a MongoDB instance on the local host where it's running, so
please make sure to install Mongo before running the API.

To start the API:
* npm start

By default the API will listen on port 10100.  Once the API is running, it will serve up 
documentation based on what's in the swagger file at this URL:
* http://<your_host>:10100/api-docs

There are three main points of interest:
* [app.js](app.js) -- The entry point, where we initialize things
* [api/controllers](controllers) -- The controller files referenced in the API spec
* [api/models](models) -- The data models used to interact with the database

