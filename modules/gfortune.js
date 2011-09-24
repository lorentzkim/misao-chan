var misaoUtil = require('../util.js');
var exec = require('child_process').exec;
var fortune = "/usr/local/bin/fortune"; // set this to your fortune executable

module.id = 'gfortune';

exports.execute = function(msg, callback) {

	var child = exec(fortune + " -a -s", function (error, stdout, stderr) {
		if(error)
			callback(error);
		else
			callback(stdout.replace(/\n/, ' '));
	});
};