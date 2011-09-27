var misaoUtil = require('../util.js');

module.id = 'help';

exports.execute = function(msg, callback) {
	text = misaoUtil.stripText(msg);
	if(text === "") {
		callback('Please visit "https://github.com/lorentzkim/misao-chan" for usage');
	} else {
		module = require('./' + text + '.js');
		callback(module.help);
	}
};
