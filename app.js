// Config

// Load required files
var sys = require('sys'),
	path = require('path'),
	fs = require('fs'),
	util = require('util'),
	misaoUtil = require('./util.js'),
	config = require('./config.js'),
	dork = require('dork');

require.paths.unshift(config.filesystem.modulesPath);

var options = config.irc;
var illegalCommands = ['load', 'unload', 'list', 'exec'];

// Listeners
var dorkBot = dork(function(j) {
	j.watch_for('privmsg', 'load', function(msg) {
		if(misaoUtil.check('load', msg)) {
			Misao.load(msg, function(reply) {
				msg.say(reply);
			});
		}
	});
	
	j.watch_for('privmsg', 'unload', function(msg) {
		if(misaoUtil.check('unload', msg)) {
			Misao.unload(msg, function(reply) {
				msg.say(reply);
			});
		}
	});
	
	j.watch_for('privmsg', 'list', function(msg) {
		if(misaoUtil.check('list', msg)) {
			Misao.list(msg, function(reply) {
				msg.say(reply);
			});
		}
	});
	
	j.watch_for('privmsg', /.*/, function(msg) {
		if(misaoUtil.isForMisao(msg)) {
			Misao.execute(msg, function(reply) {
				if(reply != undefined) {
					msg.say(reply);
				}
			});
		}
		Misao.listen(msg);
	});
	
	j.watch_for('join', /.*/, function(msg) {
		Misao.listen(msg);
	});
}).connect(options);

// Bot itself
var Misao = {

	_loadedModules: [],

	load: function(msg, callback) {
		moduleName = misaoUtil.stripText(msg).replace(/[^a-z]/, '');
		modulePath = config.filesystem.modulesPath+'/'+moduleName+'.js';
		
		path.exists(modulePath, function(exists) {
			if(!exists) {
				callback(misaoUtil.padName(msg, 'Module not found'));
			}
			else {
				if(Misao._loadedModules[moduleName] != undefined) {
					callback(misaoUtil.padName(msg, 'Module '+moduleName+' is already loaded~'));
				}
				else {
					var module = require(moduleName);
					Misao._loadedModules[moduleName] = module;
					callback(misaoUtil.padName(msg, 'Module '+moduleName+' has been loaded~'));
				}
			}
		});
	},
	
	unload: function(msg, callback) {
		moduleName = misaoUtil.stripText(msg).replace(/[^a-z]/, '');
		if(Misao._loadedModules[moduleName] != undefined) {
			delete Misao._loadedModules[moduleName];
			delete require.cache[modulePath];
			callback(misaoUtil.padName(msg, 'Module '+moduleName+' has been unloaded~'));
		}
		else {
			callback(misaoUtil.padName(msg, 'Module '+moduleName+' wasn\'t loaded~'));
		}
	},
	
	list: function(msg, callback) {
		callback(misaoUtil.padName(msg, 'Current list of modules: '+Misao._loadedModules.join(', ')));
	},
	
	execute: function(msg, callback) {
		moduleName = misaoUtil.getCommand(msg);
		for(i = 0; i < illegalCommands.length; i++) {
			if(illegalCommands[i] == moduleName) return;
		}
		
		if(Misao._loadedModules[moduleName] != undefined) {
			try {
				Misao._loadedModules[moduleName].execute(msg, function(reply) {
					if(!misaoUtil.isPM(msg)) {
						reply = misaoUtil.padName(msg, reply);
					}
					callback(reply);
				});
			}
			catch(err) {
				Misao.error(err, msg, function(reply) {
					callback(reply);
				});
			}
		}
		else {
			Misao.moduleNotFound(msg, function(reply) {
				callback(reply);
			});
		}
	},
	
	// Listen differs from execute that there's no callback, and doesn't rely
	// on module names.
	listen: function(msg) {
		for(m in Misao._loadedModules) {
			try {
				module = Misao._loadedModules[m];
				if(module.listen != undefined) {
					Misao._loadedModules[m].listen(msg, function(to, reply) {
						dorkBot.say(to, reply);
					});
				}
			}
			catch(err) {
				Misao.error(err, msg, function(reply) {
					msg.say(reply);
				});
			}
		}
	},
	
	moduleNotFound: function(msg, callback) {
		callback(misaoUtil.padName(msg, 'invalid command, mau mau~'));
	},
	
	error: function(err, msg, callback) {
		// Purposely logged
		console.log('ERROR:');
		console.log(util.inspect(err, 5));
		console.log(util.inspect(msg, 5));
		callback('module is broken D: I\'m sorrryyyyy');
	}
}
