var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var schemaQuote = new Schema({
	poster: String,
	quote: String,
	rank: Number
});

mongoose.model('Quote', schemaQuote);

exports.model = mongoose.model('Quote');
