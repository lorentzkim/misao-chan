var	mongoose = require('mongoose'),
	config = require('../config.js'),
	Tell = require('../models/last.js').model,
	misaoUtil = require('../util.js');

mongoose.connect(config.mongodb);

module.id = 'last';

exports.execute = function(msg, callback) {
	console.log(msg);
};

exports.listen_join = function(msg, callback) {
	console.log(msg);
}

exports.listen_leave = function(msg, callback) {
	console.log(msg);
}
