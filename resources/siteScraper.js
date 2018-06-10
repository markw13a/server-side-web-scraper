var request = require('request');
var Site = require('./Site');
var Opportunity = require('../models/opportunity');
var Company = require('../models/company');
const C = require('./credentials');
const {MongoClient, Server} = require('mongodb');
var Fuse = require('fuse.js');
var events = require('events');
var iconv = require('iconv-lite'); //Used to avoid character encoding issues. Found that pound symbols were coming through garbled.

//Need to know when initDB has completed execution. Would rather not have to handle event generation manually if at all possible
//Would be nice to cut down on some of these global variables
//Should no longer be needed as we don't rely on async.waterfall anymore.
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
let db;
let visadb;

async function runJobSearch(sitesToScrape){
	//Really don't like having to put siteObjects in the global scope, but I'm not sure how else to get arguments to the waterfall functions. Bit of a nuisance.
	siteObjects = sitesToScrape;
	await initDB();
	for(site of siteObjects) {
		const site = await extractHTML();
		const jobObjectArray = await extractJobListings(site);
		await pushToDatabase(jobObjectArray);
	}
	await db.close();
	// eventEmitter.once("initialised", async function main(){
	// 	//Provided only with a list of Site() objects to iterate over
	// 	//Run through all of the websites provided by siteObjects, and upload all job opportunities given on the page to a database
	// 	await siteObjects.forEach(async s =>{
	// 		const site = await extractHTML();
	// 		const jobObjectArray = await extractJobListings(site);
	// 		await pushToDatabase(jobObjectArray);
	// 	});
	// 	await mongoose.connection.close();
	// });
};

module.exports = runJobSearch;

//Establish connection to mongodb
//Need to have local JSON copy of Company database saved locally in order to run fuzzy matches using fuse.
//Downloading ~30,000 entries isn't instantaneous, so it'd be best if this only needs to be done once.
async function initDB(){
	const mongodbString = `mongodb://${C.Mongo.login}:${C.Mongo.password}@ds247047.mlab.com:47047/visadb`;
	db = await MongoClient.connect(mongodbString);
	visadb = await db.db('visadb');
	const companies = visadb.collection('companies').find({});
	fuse = new Fuse(await companies.toArray(), fuseOptions);
	//Stairway to callback hell
	// db.once("open", function retrieveDB(){
	// 	console.log('Connection to Database established');
	// 	//Save contents of "companies" collection to local variable
	// 	db.db.collection("companies", function retrieveCollection(err, collection){
	// 		Company.find({}, function saveCollection(err, jsonDB){
	// 			fuse = new Fuse(jsonDB, fuseOptions);
	// 			eventEmitter.emit("initialised");
	// 		});
	// 	});
	// 	//Delete the contents of "opportunities" in anticipation of it being updated
	// 	//This is a bit risky. Thinking about uploading first to a temp collection, then pushing to opportunities
	// 	//If an error occurs during scraping, we might be left without data to display
	// 	db.db.collection("opportunities", function deleteContents(err, opportunities){
	// 		opportunities.remove({});
	// 	});
	// });
	
};


//Extract and store HTML for website given in Site object's url property.
async function extractHTML(){
	let site = siteObjects.pop();
	// console.warn('extractHTML', site);
	//Allow for site-specific extraction function
	//Necessary to deal with sites that have awkward login process/other blockers
	if(site.extractHTML) {
		//Hack: skip this step as Edinburgh's Site doesn't rely on having Site.HTML set.
		const contents = await site.extractHTML();
		site.setHTML(contents);
		return site;
	}
	else{
		await request({url: site.getURL(), encoding: null}, function(err, res, html) {
			site.setHTML(iconv.decode(html, 'utf8'));
			return site;
		});
	}
};

async function extractJobListings(site){
	// console.warn('extractJobListings', site);
	let jobObjectArray = await site.extractRelevantInfo();
	if(jobObjectArray.length <= 0){
		//Only want to end current loop, throwing an error would mean no subsequent sites are processed.
		return console.log("No valid job listings found for site: "+ site.getURL());
	}
	
	return jobObjectArray;
};
	
//Adds any job listings found to an external database
async function pushToDatabase(jobObjectArray){
	// console.warn('pushToDatabase', jobObjectArray);
	for(job in jobObjectArray) {
		await canSponsorVisa();
	}
	//Checks if company is present in companies collection
	async function canSponsorVisa(){
		let jobObject = jobObjectArray.pop();
		//WARNING: this assumes that fuzzy match set to high precision will return either no match or a correct match. This could eventually lead to jobs being attributed to the wrong company
		let searchResult = fuse.search(jobObject.company);
		if(searchResult.length == 0){
			//return console.log("Company '" + jobObject.company + "' not found in visadb");
			return new Error("Company '" + jobObject.company + "' not found in visadb");
		} 
		else{
			let companyData = searchResult[0].item;
			console.log(jobObject.company + " has been matched to " + companyData.name);
			console.warn(jobObject);
			newJob = {
					jobTitle: jobObject.jobTitle,
					salary:	jobObject.salary,
					jobLocation: jobObject.jobLocation,
					website: jobObject.website,  
					deadline: jobObject.deadline,
					companyName: companyData.name,
			  };
			const entryAlreadyTracked = await visadb.collection('opportunities').find(newJob).toArray();
			if(entryAlreadyTracked.length > 0) console.log('Job already present in collection. _id = '+ entryAlreadyTracked[0]._id);
			else await visadb.collection('opportunities').save(newJob);
		}
	};
};
