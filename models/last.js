var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var schemaLast = new Schema({
	nick: String,
	message: String,
	dateSeen: Date
});

mongoose.model('Last', schemaLast);

exports.model = mongoose.model('Last');
