module.id = 'echo';

exports.execute = function(msg, callback) {
	callback(msg);
};

exports.help = 'Echoes input back to the channel. Usage: echo A sentence';