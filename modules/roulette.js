var	misaoUtil = require('../util.js');

module.id = 'roulette';

chambers = [ 0, 0, 0, 0, 0, 0 ];

function reload() {
	chambers[Math.floor(Math.random()*chambers.length)] = 1;
	return '\001ACTION reloads.\001';
}

exports.action = function(msg, callback) {
	text = misaoUtil.stripText(msg);
	
	var bullet = chambers.shift();
	var output = "\001ACTION fires chamber " + (6 - chambers.length) + " of 6 @ " + msg.user + " => ";
	
	if(bullet) {
		callback(output + "*BANG*\001");
		callback(reload());
	} else {
		callback(output + "+click+\001");
	}
};
reload();

exports.help = "Play a rousing game of russian roulette. Usage: roulette";