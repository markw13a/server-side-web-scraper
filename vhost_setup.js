// Have multiple small sites served from the same server
// Route domains to appropriate app
// Would have prefered to route using Nginx/Apache,
// but current server provider gives only very limited edit access.
// Need a new provider.

var express = require('express');
var path = require('path');
const vhost = require('vhost');

const markw13aApp = require('./markw13a.co.uk/app.js');
const unofficialTranslationApp = require('./unofficialtranslations.com/app.js');

var app = express();

const createVHost = (domainName, app) => vhost(domainName, app);

const jobSite = createVHost('markw13a.co.uk', markw13aApp);
const unofficialTranslationHost = createVHost('*.unofficialtranslations.com', unofficialTranslationApp);

app
 .use(unofficialTranslationHost)
 .use(jobSite);

// not sure this will ever be invoked?
app.get('/', function(req, res) {
    res.send('VHost failure: no app found for given domain');
});

module.exports = app;