var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var schemaTell = new Schema({
	from: String,
	to: String,
	message: String
});

mongoose.model('Tell', schemaTell);

exports.model = mongoose.model('Tell');
