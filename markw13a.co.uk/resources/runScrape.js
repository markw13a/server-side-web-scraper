//Want to have a function .run([Sites]) that can be called from an external function. Really shouldn't have underlying workings and current use to scrape Gradcracker rolled into one file. Very messy.
//Possible to reduce number of variables in the global scope? Tricky due to difficulty of passing arguments to async.waterfall
//Could we use a promise object to eliminate the need for an event emitter?
var gradCraker = require('./gradCrackerPage');
var runJobSearch = require('./siteScraper');
const edinburgh = require('./edinburghCareersPage');
const prospects = require('./prospects');

let siteObjects = [];

const edinburghSite = edinburgh.scrape(siteObjects);
// const prospectsSite = prospects.scrape(siteObjects);
// gradCraker.scrape(siteObjects);
// siteObjects = siteObjects.concat(edinburghSite);
siteObjects = siteObjects.concat(edinburghSite);

runJobSearch(siteObjects);