//For storing jobs pulled from websites
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OpportunitySchema = new Schema({
	jobTitle: {type: String, required: true},
	salary: {type: String},
	jobLocation: {type: String},
	website: {type: String, required: true},
	companyName: {type: String},
	deadline: {type: Date},
	company: {type: Schema.ObjectId, ref: 'Company'},
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);