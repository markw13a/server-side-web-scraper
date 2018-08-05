//Transfers contents of an Excel spreadsheet to an online database.
//I don't anticipate running this script more than a handful of times, so I haven't bothered making it presentable/efficient
var Company = require('../models/company');
var async = require('async');
var mongoose = require('mongoose');
var xlsx = require('js-xlsx');
const credentials = require('../resources/credentials');

//Establish connection to mongodb
var mongodb = `mongodb://${credentials.Mongo.login}:${credentials.Mongo.password}@ds247047.mlab.com:47047/visadb`;
mongoose.connect(mongodb, {useMongoClient: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;

let read = function(callback) {
	let exceldb = xlsx.readFile('visadb.xlsx');
	callback(null, exceldb);
};
let process = function(workbook, callback) {
	let worksheet_name = workbook.SheetNames[0];
	let worksheet = workbook.Sheets[worksheet_name];
	let companyList = [];
	
	//Go through name column. Assumes that there are no gaps in the spreadsheet
	//Start at 7 because the previous 6 cells are all blank
	i = 7;
	
	while(worksheet['A'+ i] !== undefined ){
				
		let newCompany = {
			name: worksheet['A' + i].v,
			website: (worksheet['B' + i] ? worksheet['B' + i].v : 'undefined'),
			town: worksheet['C' + i].v
		};
		
		companyList.push(newCompany);
		console.log(companyList[i-7]);
		i++;
	}
	
	callback(null, companyList);
};

createCompanies = function(companyList, callback) {
	for(let i = 0; i < companyList.length; i++) {
		let companyName = companyList[i].name;
		let jobLocation = companyList[i].town;
		let site = companyList[i].website;
		
		console.log("Name: "+companyName + " Location: " + jobLocation + " Website: " + site);
		let newCompany = Company({
			name: companyName,
			website: site,
			town: jobLocation
		});
		
//Weirdly enough, the saves don't seem to happen until all of the newCompany objects are created. Node (or one of the modules we're using) seems to be automatically
//imposing this order of operations. Very strange.
		newCompany.save(function(error) {
			if (error) throw error;
		});
	}
	
	callback(null, function() {console.log("Records successfully written to online database.")});
};

async.waterfall([
	read,
	process,
	createCompanies
],function (err, result) {
	console.log(result);
	mongoose.connection.close();//NEVER TESTED THIS. MIGHT BE BROKEN
});