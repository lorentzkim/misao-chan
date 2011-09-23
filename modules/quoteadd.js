var	mongoose = require('mongoose'),
	config = require('../config.js'),
	Quote = require('../models/quote.js').model,
	misaoUtil = require('../util.js');

mongoose.connect(config.mongodb);

module.id = 'quoteadd';

exports.execute = function(msg, callback) {
	text = misaoUtil.stripText(msg);
	
	var instance = new Quote();
	instance.poster = msg.user;
	instance.quote = text;
	instance.rank = 0;
	
	instance.save(function(err) {
		if (err) 
			callback(err);
		else 
			callback('Quote added.');
		return;
	});
};