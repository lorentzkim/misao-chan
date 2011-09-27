var	mongoose = require('mongoose'),
	config = require('../config.js'),
	Pizza = require('../models/tell.js').model,
	misaoUtil = require('../util.js');

mongoose.connect(config.mongodb);

module.id = 'pizza';

exports.execute = function(msg, callback) {
	text = misaoUtil.stripText(msg);
	index = text.indexOf(' ', 0);
	
	// Initially mine out the necessary stuff
	pizzaMsg = text.match(/"(.+)"/g);
	seconds = text.match(/\d+(|\s)((s)|(sec)|(second))/g);
	minutes = text.match(/\d+(|\s)((m)|(min)|(minute))/g);
	hours = text.match(/\d+(|\s)((h)|(hour))/g);	
	
	// Then do further processing
	if (seconds == null) {
		seconds = 0;
	} else {
		seconds = seconds.join('').replace(/[a-zA-Z]/g, '');
	}
	
	if (minutes == null) {
		minutes = 0;
	} else {
		minutes = minutes.join('').replace(/[a-zA-Z]/g, '');
	}
	
	if (hours == null) {
		hours = 0;
	} else {
		hours = hours.join('').replace(/[a-zA-Z]/g, '');
	}
	
	// Total seconds
	totalSeconds = seconds + (minutes * 60) + (hours * 60 * 60);
	
	if(totalSeconds == 0) {
		reply = 'please set the timer~';
	} else {
		if (pizzaMsg != null) {
			reply = 'OK, I\'ll remind you about ' + pizzaMsg + '~';
			pizzaReply = 'Your pizza '+pizzaMsg+' is ready~';
		} else {
			reply = 'OK, I\'ll remind you~';
			pizzaReply = 'Your pizza is ready~';
		}
		setTimeout(function() {
			callback(pizzaReply);
		}, 1000 * totalSeconds);
	}
	
	callback(reply);
};

exports.help = "Pizza is basically a timer. 10m is an example time, meaning 10 minutes. After 10 minutes, bot will reply back with message you assigned it with. Anything between the \"\"s will be parsed as the return message. Usage: pizza 10m \"Your message\"";