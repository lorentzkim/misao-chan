var misaoUtil = require('../util.js');

module.id = 'choose';

exports.execute = function(msg, callback) {
	text = misaoUtil.stripText(msg);
	choices = text.split(' or ');
	
	if(choices.length == 1) {
		reply = 'Make a proper choice, mau mau~';
		
	} else {
		reply = 'I choose... "'+choices[Math.floor(Math.random()*choices.length)]+'"';
	}
	
	callback(reply);
};

exports.help = "Randomly select between two options. Usage: choose a or b"