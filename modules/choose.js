var util = require('../util.js'),
	misaoUtil = require('../util.js');;

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
