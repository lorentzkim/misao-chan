var misaoUtil = require('../util.js');
var dns = require('dns');

module.id = 'host';

exports.execute = function(msg, callback) {
	text = misaoUtil.getEverythingElse(msg);
	dns.lookup(text, function(err, address, family) {
		if(err) throw err;
		callback(address);
	});
};

exports.help = "Look up the IP address of a given host name."