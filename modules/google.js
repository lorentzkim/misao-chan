var misaoUtil = require('../util.js');

module.id = 'google';

exports.execute = function(msg, callback) {
	callback(encodeURI("http://google.com/search?q=" + misaoUtil.stripText(msg)));
};

exports.help = "Constructs a clickable Google search query URL. Usage: google <search terms>."