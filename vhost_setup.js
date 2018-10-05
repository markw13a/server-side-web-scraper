// Have multiple small sites served from the same server
// Route domains to appropriate app
// Would have prefered to route using Nginx/Apache,
// but current server provider gives only very limited edit access.
// Need a new provider.

var express = require('express');
var path = require('path');
const vhost = require('vhost');

var app = express();

const createVHost = (domainName, dirPath) => vhost(domainName, express.static(dirPath));

const jobSite = createVHost('markw13a.co.uk', path.join(__dirname, 'markw13a.co.uk', 'app.js'));
const unofficialTranslationHost = createVHost('unofficialtranslations.com', path.join(__dirname, 'unofficialtranslations.com', 'apps.js'));
app
 .use(unofficialTranslationHost)
 .use(jobSite);

module.exports = app;