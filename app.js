// Config

// Load required files
var sys = require('sys'),
	path = require('path'),
	fs = require('fs'),
	util = require('util'),
	misaoUtil = require('./util.js'),
	config = require('./config.js'),
	jerk = require('jerk');

require.paths.unshift(config.filesystem.modulesPath);

var options = config.irc;
var illegalCommands = ['load', 'unload', 'list', 'exec', 'join', 'part'];

// Listeners
var jerkBot = jerk(function(j) {

	j.watch_for('join', function(msg) {
		if(misaoUtil.check('join', msg)) {
			Misao.join(msg, function(reply) {
				msg.say(reply);
			});
		}
	});
	
	j.watch_for('part', function(msg) {
		if(misaoUtil.check('part', msg)) {
			Misao.part(msg, function(reply) {
				msg.say(reply);
			});
		}
	});

	j.watch_for('load', function(msg) {
		if(misaoUtil.check('load', msg)) {
			Misao.load(msg, function(reply) {
				msg.say(reply);
			});
		}
	});
	
	j.watch_for('unload', function(msg) {
		if(misaoUtil.check('unload', msg)) {
			Misao.unload(msg, function(reply) {
				msg.say(reply);
			});
		}
	});
	
	j.watch_for('list', function(msg) {
		if(misaoUtil.check('list', msg)) {
			Misao.list(msg, function(reply) {
				msg.say(reply);
			});
		}
	});
	
	j.watch_for(/.*/, function(msg) {
		if(misaoUtil.isForMisao(msg)) {
			Misao.execute(msg, function(reply) {
				if(reply != undefined) {
					msg.say(reply);
				}
			});
		}
		Misao.listen('privmsg', msg);
	});
	
	j.user_join(/.*/, function(msg) {
		Misao.listen('join', msg);
	});
	
	j.user_leave(/.*/, function(msg) {
		Misao.listen('leavel', msg);
	});
}).connect(options);

// Bot itself
var Misao = {

	_loadedModules: [],

	load: function(msg, callback) {
		try {
			// Actual module name here is the argument, not 'load' module
			moduleName = misaoUtil.stripText(msg).replace(/[^a-z\-0-9]/, '');
			
			Misao._loadModule(moduleName, function(reply) {
				callback(misaoUtil.padName(msg, reply));
			});
		}
		catch (err) {
			Misao.error(err, msg, function(reply) {
				callback(reply);
			});
		}
	},
	
	_loadModule: function(moduleName, callback) {
		modulePath = config.filesystem.modulesPath+'/'+moduleName+'.js';
		path.exists(modulePath, function(exists) {
			if(!exists) {
				callback('Module not found');
			}
			else {
				if(Misao._loadedModules[moduleName] != undefined) {
					callback('Module '+moduleName+' is already loaded~');
				}
				else {
					var module = require(moduleName);
					Misao._loadedModules[moduleName] = module;
					callback('Module '+moduleName+' has been loaded~');
				}
			}
		});
	},
	
	unload: function(msg, callback) {
		moduleName = misaoUtil.stripText(msg).replace(/[^a-z\-0-9]/, '');
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
		var modules  = [];
		for(m in Misao._loadedModules) {
			modules.push(m);
		}
		callback('Current list of modules: '+modules.join(', '));
	},
	
	execute: function(msg, callback) {
		moduleName = misaoUtil.getCommand(msg);
		for(i = 0; i < illegalCommands.length; i++) {
			if(illegalCommands[i] == moduleName) return;
		}
		
		if(Misao._loadedModules[moduleName] != undefined) {
			try {
				Misao._loadedModules[moduleName].execute(msg, function(reply, isAction) {
					if(!misaoUtil.isPM(msg)) {
						reply = misaoUtil.padName(msg, reply);
					}
					if(isAction) {
						reply = misaoUtil.makeAction(msg, reply);;
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
	
	// Listens differs from execute that there's no callback, and doesn't rely
	// on module names.
	listen: function(type, msg) {
		for(m in Misao._loadedModules) {
			try {
				method = 'listen_' + type;
				module = Misao._loadedModules[m];
				if(module.hasOwnProperty(method)) {
					Misao._loadedModules[m][method](msg, function(to, reply) {
						jerkBot.say(to, reply);
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
	
	join: function(msg, callback) {
		words = misaoUtil.stripText(msg).split(' ');
		if(words[0].match(/^#\w+/)) {
			jerkBot.join(words[0]);
		}
	},
	
	part: function(msg, callback) {
		words = misaoUtil.stripText(msg).split(' ');
		if(words[0].match(/^#\w+/)) {
			jerkBot.part(words[0]);
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

// Load default modules
for(i = 0; i < config.startup.modules.length; i++) {
	Misao._loadModule(config.startup.modules[i], function(reply) {
	
	});
};
