var Opportunity = require('../models/opportunity');
var mongoose = require('mongoose');
var async = require('async');

let db;
let category;

exports.index = function(req, res){
	db = initDB();
	category = req.params.sortBy;
	
	db.once("open", function(){		
			async.waterfall(
				[downloadJobs,
				 sortResults],
				function render(err, jobsArray){
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
	console.log("here");
	db.db.collection("opportunities", function(err, results){
		Opportunity.find({}, function exportCollection(err, contents){
			cb(null, contents);
		});
	});
};

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
			
		case "website":
			array.sort(websiteComparison);
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