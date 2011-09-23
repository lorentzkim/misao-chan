var	mongoose = require('mongoose'),
	config = require('../config.js'),
	Quote = require('../models/quote.js').model,
	misaoUtil = require('../util.js');

mongoose.connect(config.mongodb);

module.id = 'quote';

exports.execute = function(msg, callback) {
	text = misaoUtil.stripText(msg);
	cmd = text.substr(0, text.indexOf(' ', 0));
	
	switch(cmd) {
		case 'add':
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
			})
			break;
		default:
			if(text === '') {
				Quote.find({}, function(err, docs) {
					try {
						callback(docs[Math.floor(Math.random()*(docs.length+1))].quote);
					}
					catch(err) {
						callback("No quotes found!");
					}
				});
			}
			else {
				Quote.find({'quote': new RegExp('.*' + text + '.*', 'i')}, function(err, docs) {
					if(docs.length == 0)
						callback("No quotes found!");
					docs.forEach(function(doc, idx, arr) {
						callback(doc.quote);
					});
				});
			}
			break;
	}
};