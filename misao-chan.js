// Config

// Load required files
var sys = require('sys'),
	path = require('path'),
	fs = require('fs'),
	config = require('./config.js'),
	dork = require('dork'),
	mongoose = require('mongoose'),
	Tell = require('./models/tell.js').model;

var options = config.irc;

mongoose.connect(config.mongodb);

// Listeners
dork(function(j) {
	j.watch_for('join', /.*/, function(msg) {
		Misao.join(msg);
	});
	
	j.watch_for('privmsg', /.*/, function(msg) {
		Misao.catchAll(msg, function(reply) {
			msg.say(reply);
		});
	});
	
	j.watch_for('privmsg', listenRegex('tell'), function(msg) {
		Misao.tell(msg, function(reply) {
			msg.say(reply);
		});
	});

	j.watch_for('privmsg', listenRegex('fortune'), function(msg) {
		Misao.fortune(msg, function(reply) {
			msg.say(reply);
		});
	});

	j.watch_for('privmsg', listenRegex('choose'), function(msg) {
		Misao.choose(msg, function(reply) {
			msg.say(reply);
		});
	});

	j.watch_for('privmsg', listenRegex('help'), function(msg) {
		Misao.help(msg, function(reply) {
			msg.say(reply);
		});
	});

	j.watch_for('privmsg', listenRegex('~'), function(msg) {
		Misao.maumau(msg, function(reply) {
			msg.say(reply);
		});
	});
}).connect(options);

// Create regex obj for listening
function listenRegex(listenString) {
	return new RegExp("^"+options.nick+": "+listenString+"($|\\s)");
}

// Strip msg text for use in methods
function stripText(text) {
	regex = new RegExp("^"+options.nick+": \\w+($|\\s)");
	return text.replace(regex, '');
}

function padName(msg, result) {
	return msg.user+': '+result;
}

// Bot itself
var Misao = {
	
	help: function(msg, callback) {
		callback(padName(msg, 'Please visit "https://github.com/lorentzkim/misao-chan" for usage'));
	},
	
	join: function(msg, callback) {
		this.tellProcess(msg, function(call) {
			callback(call);
		});
	},
	
	catchAll: function(msg, callback) {
		this.tellProcess(msg, function(call) {
			callback(call);
		});
	},
	
	fortune: function(msg, callback) {
		msgs = [];
		for(i in config.fortune) {
			eval(i+' = config.fortune.'+i+'[Math.floor(Math.random()*config.fortune.'+i+'.length)];');
			msgs.push((i.slice(0,1).toUpperCase() + i.slice(1)) + ': ' + (eval(i)));
		}
		
		callback(padName(msg, msgs.join(' | ')));
	},
	
	tell: function(msg, callback) {		
		text = stripText(msg.text[0]);
		index = text.indexOf(' ', 0);
		success = false;
		if(index > 0) {
			to = text.substr(0, text.indexOf(' ', 0));
			toMessage = text.substr(text.indexOf(' ', 0) + 1);
			
			var instance = new Tell();
			instance.from = msg.user;
			instance.to = to;
			instance.message = toMessage;
			
			instance.save(function(err) {
				if (err) callback(this.maumau(msg));
				else callback(padName(msg, 'OK, I\'ll tell~'));
				return;
			});
		}
	},
	
	tellProcess: function (msg, callback) {
		Tell.find({to: msg.user}, function(err, docs) {
			while(result = docs.pop()) {
				callback(result.doc.to+': '+result.doc.from+' told me to tell you "'+result.doc.message+'"~');
				result.remove();
			}
		});
	},
	
	choose: function(msg, callback) {
		text = stripText(msg.text[0]);
		choices = text.split(' or ');
		
		if(choices.length == 1) {
			reply = 'Make a proper choice, mau mau~';
			
		} else {
			reply = 'I choose... "'+choices[Math.floor(Math.random()*choices.length)]+'"';
		}
		
		callback(padName(msg, reply));
	},
	
	maumau: function(msg) {
		return padName(msg, 'mau mau~');
	},
	
	methodNotFound: function(msg) {
		return 'Invalid command, mau mau~';
	}
}
