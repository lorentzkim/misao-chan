var	mongoose = require('mongoose'),
	config = require('../config.js'),
	Tell = require('../models/tell.js').model,
	misaoUtil = require('../util.js');

mongoose.connect(config.mongodb);

module.id = 'tell';

exports.execute = function(msg, callback) {
	text = misaoUtil.stripText(msg);
	index = text.indexOf(' ', 0);
	success = false;
	if(index > 0) {
		to = text.substr(0, text.indexOf(' ', 0));
		toMessage = text.substr(text.indexOf(' ', 0) + 1);
		
		var instance = new Tell();
		instance.from = msg.user;
		instance.to = to;
		instance.message = toMessage;
		
		instance.save(function(err) {
			if (err) callback(err);
			else callback('OK, I\'ll tell~');
			return;
		});
	}
};

exports.listen = function(msg, callback) {
	Tell.find({to: msg.user}, function(err, docs) {
		while(result = docs.pop()) {
			callback(result.doc.to, result.doc.from+' told me to tell you "'+result.doc.message+'"~');
			result.remove();
		}
	});
}
