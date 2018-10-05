//Will be populated with list of companies able to sponsor Tier 2 visas in the UK
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CompanySchema = new Schema({
	name: {type:String, required: true},
	town: {type:String, required: true},
	website: {type:String, required: true}
});

module.exports = mongoose.model('Company', CompanySchema);