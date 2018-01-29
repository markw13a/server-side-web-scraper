//Decided to stick with an OO design for the server-side version of the scraper. Will be dealing with multiple sites in the same file, need some easy way of keeping track of each sites contents as well as criteria used for scraping these.
var request = require('request');
var async = require('async');

var Site = function(siteURL){
	var url = siteURL;
	var html;
	
	this.getURL = function(){
		return url;
	};
	this.getHTML = function(){
		return html;
	};
	
	this.setHTML = function(contents) {
		html = contents;
	};
}

Site.prototype.extractRelevantInfo;

//User needs to provide criteria for scraping a given site's HTML.
//Not sure if there's a way of enforcing type of output given by filterFunction. Can set something to throw an error if this is not an array of objects.
Site.prototype.setExtractRelevantInfo = function(filterFunction){
	this.extractRelevantInfo = filterFunction;
};

module.exports = Site;