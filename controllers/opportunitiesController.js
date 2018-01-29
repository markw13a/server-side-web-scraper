var Company = require('../models/company');
var Opportunity = require('../models/opportunity');

var mongoose = require('mongoose');
var async = require('async');

var db;

exports.index = function(req, res){
	db = initDB();
	
	db.once("open", function(){
		async.waterfall([
				downloadJobs
			], 
			function(err, jobsArray){
				let sortedByCompany = jobsArray;
				res.render('index', {data: jobsArray});
		});
	});
};

let initDB = function(){
	var mongodb = 'mongodb://admin:admin1453@ds247047.mlab.com:47047/visadb';
	mongoose.connect(mongodb, {useMongoClient: true});
	mongoose.Promise = global.Promise;
	var db = mongoose.connection;
	
	return db;
};

// exports.index = function(req, res){
	// async.waterfall([
			// initDB,
			// downloadJobs
		// ], 
		// function(err, jobsArray){
			// if(err){
				// throw err;
			// }
			// res.render('index', {data: jobsArray});
	// });
// };

// let initDB = function(callback){
	// var mongodb = 'mongodb://admin:admin1453@ds247047.mlab.com:47047/visadb';
	// mongoose.connect(mongodb, {useMongoClient: true});
	// mongoose.Promise = global.Promise;
	// var db = mongoose.connection;
	
	// callback(null, db);
// };

let downloadJobs = function(callback){
	db.db.collection("opportunities", function(err, results){
		Opportunity.find({}, function exportCollection(err, contents){
			callback(null, contents);
		});
	});
};