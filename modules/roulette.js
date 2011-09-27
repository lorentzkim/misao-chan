var	misaoUtil = require('../util.js');

module.id = 'roulette';

chambers = [ 0, 0, 0, 0, 0, 0 ];

function reload() {
	chambers = [ 0, 0, 0, 0, 0, 0 ];
	chambers[Math.floor(Math.random()*chambers.length)] = 1;
	return 'reloads.';
}

exports.execute = function(msg, callback) {
	text = misaoUtil.stripText(msg);
	
	var bullet = chambers.shift();
	var output = "chamber " + (6 - chambers.length) + " of 6 => ";
	
	if(bullet) {
		callback(output + "*BANG*");
		callback(reload(), true);
	} else {
		callback(output + "+click+");
	}
};
reload();

exports.help = "Play a rousing game of russian roulette. Usage: roulette";