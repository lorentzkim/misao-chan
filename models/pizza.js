var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var schemaPizza = new Schema({
	from: String,
	to: String,
	date: Date,
	message: String
});

mongoose.model('Pizza', schemaTell);

exports.model = mongoose.model('Pizza');
