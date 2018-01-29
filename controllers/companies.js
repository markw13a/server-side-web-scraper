var Company = require('../models/company');
var async = require('async');
var mongoose = require('mongoose');
var xlsx = require('js-xlsx');

exports.index = function(req, res) {
	   async.parallel({
        findKiltane: function(callback) {
			Company.findOne({name:'Kiltane'}, callback);
        }
    }, function(err, results) {
        res.render('companies', { title: 'Local Library Home', data: results.name });
    });
}

// exports.generateDB = function(req, res) {
	
	// async.waterfall([
		// read,
		// process
	// ],function (err, result) {
		// res.send(result);
	// });
	
	// let read = function(callback) {
		// let exceldb = xlsx.readFile('./resources/visadb.xlsx');
		// callback(null, exceldb);
	// };
	// let process = function(workbook, callback) {
		// let worksheet_name = workbook.SheetNames[0];
		// let worksheet = workbook.Sheets[worksheet_name];
		
		// //Go through name column. Assumes that there are no gaps in the spreadsheet
		// let cell = worksheet['A7'];
		// i = 7;
		
		// while( (cell = worksheet['A'+ i])  
				// !== undefined ){
			
			// console.log(cell.v);
			// i++;
		// }
		
		// callback(null, worksheet);
	// };
// };

exports.createCompany = function(req, res) {
	let companyName = req.param('id');
	let jobLocation = req.param('town');
	let site = req.param('website');
	
	console.log(companyName + " " + jobLocation);
	let newCompany = Company({
		name: companyName,
		town: jobLocation,
		website: (site ? site : '')//Set to blank string if url is undefined
	});

	newCompany.save(function(error) {
		if (error) throw error;
	});
};