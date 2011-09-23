var misaoUtil = require('../util.js');

module.id = 'google';

exports.execute = function(msg, callback) {
	callback("http://google.com/search?q=" + misaoUtil.stripText(msg));
};
