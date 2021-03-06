var backboneJsonApi = require('backbone-json-api');
var _ = require('underscore');
var app = require('../app');
var api = require('./api');

// Model prototype methods
_.extend(backboneJsonApi.Model.prototype, {
    urlRoot: function() {
        return app.get('router').apiUrl(this.getType());
    },
    http: api
});

// Model static methods
_.extend(backboneJsonApi.Model, {
    apiUrl: function(resourceName, resourceId) {
        return app.get('router').apiUrl(resourceName, resourceId);
    },
    createFromApiData: backboneJsonApi.Model.createFromData
});

// Collection prototype methods
_.extend(backboneJsonApi.Collection.prototype, {
    http: api
});

// Collection static methods
_.extend(backboneJsonApi.Collection, {
    apiUrl: function(resourceName, params) {
        return app.get('router').apiUrl(resourceName, null, params);
    },
    createFromApiData: backboneJsonApi.Collection.createFromData
});

module.exports = backboneJsonApi;
