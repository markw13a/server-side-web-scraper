var request = require('request');
var Site = require('./Site');
var async = require('async');
var Opportunity = require('../models/opportunity');
var Company = require('../models/company');
var mongoose = require('mongoose');
var Fuse = require('fuse.js');
var events = require('events');

//Need to know when initDB has completed execution. Would rather not have to handle event generation manually if at all possible
var eventEmitter = new events.EventEmitter();
var siteObjects;
var fuse;
var fuseOptions = {
		caseSensitive: false,
		shouldSort: true,
		includeScore: true,
		threshold: 0.01,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: [
		"name"
		]
};

function runJobSearch(sitesToScrape){
	//Really don't like having to put siteObjects in the global scope, but I'm not sure how else to get arguments to the waterfall functions. Bit of a nuisance.
	siteObjects = sitesToScrape;
	initDB();
	eventEmitter.once("initialised", function main(){
	//Provided only with a list of Site() objects to iterate over
	//Run through all of the websites provided by siteObjects, and upload all job opportunities given on the page to a database
		while(siteObjects.length > 0){
			async.waterfall([             
					extractHTML,
					extractJobListings,
					pushToDatabase
				], function(err, result){
					if(err){
						throw err;
					};
					//mongoose.connection.close();
				});
			}	
		});
};

module.exports = runJobSearch;

//Establish connection to mongodb
//Need to have local JSON copy of Company database saved locally in order to run fuzzy matches using fuse.
//Downloading ~30,000 entries isn't instantaneous, so it'd be best if this only needs to be done once.
function initDB(){
	var mongodb = 'mongodb://admin:admin1453@ds247047.mlab.com:47047/visadb';
	mongoose.connect(mongodb, {useMongoClient: true});
	mongoose.Promise = global.Promise;
	let db = mongoose.connection;
	
	//Stairway to callback hell
	db.once("open", function retrieveDB(){
		//Save contents of "companies" collection to local variable
		db.db.collection("companies", function retrieveCollection(err, collection){
			Company.find({}, function saveCollection(err, jsonDB){
				fuse = new Fuse(jsonDB, fuseOptions);
				eventEmitter.emit("initialised");
			});
		});
		//Delete the contents of "opportunities" in anticipation of it being updated
		//This is a bit risky. Thinking about uploading first to a temp collection, then pushing to opportunities
		//If an error occurs during scraping, we might be left without data to display
		db.db.collection("opportunities", function deleteContents(err, opportunities){
			opportunities.remove({});
		});
		
	});
};


//Extract and store HTML for website given in Site object's url property.
function extractHTML(callback){
	let site = siteObjects.pop();
	
	request(site.getURL(), function(err, res, html) {
		site.setHTML(html);
		callback(null, site);
	});
};

function extractJobListings(site, callback){
	let jobObjectArray = site.extractRelevantInfo();

	if(jobObjectArray.length <= 0){
		//Only want to end current loop, throwing an error would mean no subsequent sites are processed.
		return console.log("No valid job listings found for site: "+ site.getURL());
	}
	
	callback(null, jobObjectArray);
};
	
//Adds any job listings found to an external database
function pushToDatabase(jobObjectArray, callback){
	
	while(jobObjectArray.length > 0){
			async.waterfall([
					canSponsorVisa,
					pushJobToCollection
				]);
		};
		
	//Checks if company is present in companies collection
	function canSponsorVisa(callback){
		let jobObject = jobObjectArray.pop();
		//WARNING: this assumes that fuzzy match set to high precision will return either no match or a correct match. This could eventually lead to jobs being attributed to the wrong company
		let searchResult = fuse.search(jobObject.company);
		
		if(searchResult.length == 0){
			return console.log("Company '" + jobObject.company + "' not found in visadb");
		} 
		else{
			let companyData = searchResult[0].item;
			console.log(jobObject.company + " has been matched to " + companyData.name);
			newJob = Opportunity({
					jobTitle: jobObject.jobTitle,
					salary:	jobObject.salary,
					jobLocation: jobObject.jobLocation,
					website: jobObject.website,  
					deadline: jobObject.deadline,
					companyName: companyData.name,
					company: new Company(companyData)
			  });
			  callback(null, newJob);
		}
	};

	function pushJobToCollection(newJob, callback){
		newJob.save(function(err){
			if(err){throw err}
		});
		callback(null, newJob);
	};		
};