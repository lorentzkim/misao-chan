var	mongoose = require('mongoose'),
	config = require('../config.js'),
	Quote = require('../models/quote.js').model,
	misaoUtil = require('../util.js');

mongoose.connect(config.mongodb);

module.id = 'quote';

exports.execute = function(msg, callback) {
	text = misaoUtil.stripText(msg);
	
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
};

exports.help = "Searches the quotes database based on given parameters. If no search terms are given, a random quote is selected. Usage: quote awesome";