var Opportunity = require('../models/opportunity');
var mongoose = require('mongoose');
var async = require('async');
var Fuse = require('fuse.js');

let db;
let category;
let searchQuery;

exports.index = function(req, res){
	db = initDB();
	category = req.query.sortBy;
	//Not used until filterJobs is called
	searchQuery = req.query.query;
	
	db.once("open", function(){		
			async.waterfall(
				[downloadJobs,
				 filterJobs,
				 sortResults],
				function render(err, jobsArray){
					console.log(jobsArray[0]);
					res.render('index', {data: jobsArray});
				}
			);
	});
};

function initDB(){
	var mongodb = 'mongodb://admin:admin1453@ds247047.mlab.com:47047/visadb';
	mongoose.connect(mongodb, {useMongoClient: true});
	mongoose.Promise = global.Promise;
	var db = mongoose.connection;
	
	return db;
};

function downloadJobs(cb){
	db.db.collection("opportunities", function(err, results){
		Opportunity.find({}, function exportCollection(err, jobsArray){
			console.log(jobsArray[0]);
			cb(null, jobsArray);
		});
	});
};

function filterJobs(jobsArray, cb){
	let fuseOptions = {
		caseSensitive: false,
		threshold: 0.2,
		tokenize: true,
		location: 0,
		distance: 100,
		maxPatternLength: 1000,
		minMatchCharLength: 1,
		keys: [
		"jobTitle",
		"salary",
		"jobLocation",
		"companyName",
		"deadline"
		]
	};
	
	if(searchQuery == undefined){
		cb(null, jobsArray);
	}
	else{
		let fuse = new Fuse(jobsArray, fuseOptions);
		let searchResults = fuse.search(searchQuery);
		
		cb(null, searchResults);
	}
}

function sortResults(jobsArray, cb){
	sortByCategory(category, jobsArray);
	cb(null, jobsArray);
};

function sortByCategory(category, array){
	switch(category){
		case "jobTitle":
			array.sort(titleComparison);
			break;
			
		case "companyName":
			array.sort(companyComparison);
			break;
			
		case "jobLocation":
			array.sort(locationComparison);
			break;
			
		case "salary":
			array.sort(salaryComparison);
			break;
			
		case "website":
			array.sort(websiteComparison);
			break;
		
		case "deadline":
			array.sort(deadlineComparison);
			break;
		default:
			break;
	};
};

function titleComparison(a, b){
	let titleA = a.jobTitle;
	let titleB = b.jobTitle;
	
	if(titleA < titleB){
		return -1;
	}
	else{
		return 1;
	}
};

function companyComparison(a, b){
	let companyA = a.companyName;
	let companyB = b.companyName;
	
	if(companyA < companyB){
		return -1;
	}
	else{
		return 1;
	}
};

function salaryComparison(a, b){
	let salaryA = a.salary;
	let salaryB = b.salary;
	
	//Simple comparison might not be the most sensible for this (salaries gives are often a mix of text and numbers), but it'll do for the moment.
	if(salaryA < salaryB){
		return 1;
	}
	else{
		return -1;
	}
}

function locationComparison(a, b){
	let locationA = a.jobLocation;
	let locationB = b.jobLocation;
	
	if(locationA < locationB){
		return -1;
	}
	else{
		return 1;
	}
};

function websiteComparison(a, b){
	let websiteA = a.website;
	let websiteB = b.website;
	
	if(websiteA < websiteB){
		return -1;
	}
	else{
		return 1;
	}
};

function deadlineComparison(a, b){
	let deadlineA = a.deadline;
	let deadlineB = b.deadline;
	
	if(deadlineA < deadlineB){
		return -1;
	}
	else{
		return 1;
	}
};