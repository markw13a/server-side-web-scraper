var request = require('request');
var cheerio = require('cheerio');
var Site = require('./Site');
var async = require('async');
var Opportunity = require('../models/opportunity');
var Company = require('../models/company');
var mongoose = require('mongoose');
var Fuse = require('fuse.js');
var events = require('events');

//Not really sure of best way to handle if/else statements with asynchronous programming. Made an attempt with pushToDatabase()

//Establish connection to mongodb
//Need to have local JSON copy of Company database saved locally in order to run fuzzy matches using fuse.
//Downloading ~30,000 entries isn't instantaneous, so it'd be best if this only needs to be done once.
var db;
var jsonCompanyDB;
var eventEmitter = new events.EventEmitter();//Need to know when initDB has completed execution. Would rather not have to handle event generation manually if at all possible
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

let initDB = function(){
	var mongodb = 'mongodb://admin:admin1453@ds247047.mlab.com:47047/visadb';
	mongoose.connect(mongodb, {useMongoClient: true});
	mongoose.Promise = global.Promise;
	db = mongoose.connection;
	
	db.once("open", function retrieveDB(){
		db.db.collection("companies", function retrieveCollection(err, collection){
			Company.find({}, function saveCollection(err, jsonDB){
				jsonCompanyDB = jsonDB;
				fuse = new Fuse(jsonCompanyDB, fuseOptions);
				eventEmitter.emit("done");
			});
		});
	});
	
};

//List of URLs from which to populate job database
let gradCrackURL = 'https://www.gradcracker.com/search/engineering-graduate-jobs';
let sitesToScrape = [];
let siteObjects = [];

let gradCrackerExtractor = function(){	
	let site = this.getURL();
	let html = this.getHTML();

	let $ = cheerio.load(html);
	let outArray = [];

	//Find salaries & location
	$('div[class=tbl]').each(function(i, ele){
		let jobInfoCard = $(this);
		let salaryAndLocation = jobInfoCard.find('div:nth-child(2) > div:first-child > div > div > div > div').html();
		let imageLink = jobInfoCard.find('div > div > div > div > a').attr().href;

		//As Salary and location information is not included within DOM for Gradcracker, forced to use regex to extract this information
		let salaryRegEx = /<strong>Salary:<\/strong>(.*)<br>/;
		let locationRegEx = /<strong>Location:<\/strong>(.*)<br>/;
		
		let newJobObj = {
			 jobTitle: null, 
			 salary: null,
			 jobLocation: null,
			 website: null,
			 company: null
		}
		
		newJobObj.jobTitle = jobInfoCard.find('h2[class=opportunity-title] > a').html();
		newJobObj.salary = salaryAndLocation.match(salaryRegEx)[1];
		newJobObj.jobLocation = salaryAndLocation.match(locationRegEx)[1];
		newJobObj.website = site;
		newJobObj.company  = extractCompanyNameFromURL(imageLink);
		
		outArray.push(newJobObj);
	});
	return(outArray);
};
//Name of company is not directly listed for Gradcracker job postings: images are used instead. I still need the company's name for a later database query, and it turns out that the only reference to the the company's name on the entire job posting is as an argument to an internal link.
//Output names will be in lower-case with all hyphens removed.
let extractCompanyNameFromURL = function(url){
	//Example urls:
	//https://www.gradcracker.com/hub/528/mace-group
	//https://www.gradcracker.com/hub/3/mott-macdonald
	//https://www.gradcracker.com/hub/236/bank-of-america-merrill-lynch
	//Want to extract and clean name at the end
	let regEx = /[0-9]\/(.*)/;
	let companyName = url.match(regEx)[1];
	companyName = companyName.replace(/-/g, ' ');
	
	return companyName;
};

for(let i =0; i < 17; i++){
	let newSite = new Site(gradCrackURL + "?page=" + i);
	newSite.setExtractRelevantInfo(gradCrackerExtractor);
	siteObjects.push(newSite);
}

//Extract and store HTML for website given in Site object's url property.
let extractHTML = function(callback){
	let site = siteObjects.pop();
	
	request(site.getURL(), function(err, res, html) {
		site.setHTML(html);
		callback(null, site);
	});
};

let extractJobListings = function(site, callback){
	let jobObjectArray = site.extractRelevantInfo();

	if(jobObjectArray.length <= 0){
		//Only want to end current loop, throwing an error would mean no subsequent sites are processed.
		console.log("No valid job listings found for site: "+ site.getURL());
		return;
	}
	
	callback(null, jobObjectArray);
};
	

//Adds any job listings found to an external database
let pushToDatabase = function(jobObjectArray, callback){
	//////////////////////
	//Functions to be used within pushToDatabase
	//Process involves making asynchronous call to db for each job.
	//Therefore need another async.waterfall chain

	//Checks if company is already present in companies collection
	let canSponsorVisa = function(callback){
		let jobObject = jobObjectArray.pop();
		//Check that all fields needed to fill an Opportunity object are present
		// if(
			// jobDetails.jobTitle === 'undefined'||
			// jobDetails.salary === 'undefined'||
			// jobDetails.jobLocation === 'undefined'||
			// jobDetails.website === 'undefined'||
			// jobDetails.company === 'undefined'
		// ){
			// console.log("Results returned ( "+jobDetails+") are missing information needed to create an Opportunity object. Skipping current Object");
			// return;
		// } 
		//Make sure that connection to DB is open if this part isn't working
		db.db.collection("companies", function(err, collection){
			//WARNING: this assumes that fuzzy match set to high precision will return either no match or a correct match. This could eventually lead to jobs being attributed to the wrong company
			let searchResult = fuse.search(jobObject.company);
			if(searchResult.length == 0){
				return console.log("Company '" + jobObject.company + "' not found in visadb");
			} else{
				let companyData = searchResult[0].item;
				console.log(jobObject.company + " has been matched to " + companyData.name);
				newJob = Opportunity({
						jobTitle: jobObject.jobTitle,
						salary:	jobObject.salary,
						jobLocation: jobObject.jobLocation,
						website: jobObject.website,  
						companyName: companyData.name,
						company: new Company(companyData)
				  });
				  callback(null, newJob);
			}
		});
	};

	let pushJobToCollection = function(newJob, callback){
		newJob.save(function(err){
			if(err){throw err}
		});
		callback(null, newJob);
	};
	/////////////////////

	while(jobObjectArray.length > 0){
			async.waterfall([
					canSponsorVisa,
					pushJobToCollection
				], function(err, result){
			});
		};
};


initDB();
eventEmitter.once("done", function main(){
	//Provided only with a list of Site() objects to iterate over
	//Run through all of the websites provided by sitesToScrape, and upload all job opportunities given on the page to a database
	while(siteObjects.length > 0){
		async.waterfall([             
				extractHTML,
				extractJobListings,
				pushToDatabase
			], function(err, result){
				if(err){
					throw err;
				};
				mongoose.connection.close();
			});
	}	
});