var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema({
	title: {type: String},
	author: {type: Schema.},
	yearOfPublication: {type: Number}
});