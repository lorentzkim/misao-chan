module.id = 'd20';

exports.execute = function(msg, callback) {
	var roll = Math.floor(Math.random()*20);
	if(roll == 20 || roll == 1)
		callback(roll + "!");
	else
		callback(roll + ".");
};

exports.help = "Roll a d20."