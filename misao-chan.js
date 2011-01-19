// Config

// Load required files
var sys = require('sys'),
	path = require('path'),
	fs = require('fs'),
	config = require('./config.js'),
	irc = require('irc-js');

var irc_instance = new irc(config.irc);

var misao = new Misao();

irc_instance.addListener('privmsg', privmsgListener);
irc_instance.connect(onConnect);

// Listeners

function onConnect() {
	setTimeout(function() {
		irc_instance.join('#misao-chan');
	}, 15000);
}

function privmsgListener(message) {
	var to, method, command;
	if(message.params[0] == config.irc.nick) {
		// It's in private message
		to = message.person.nick;
		splitMessage = message.params[1].split(' ');
		method = 'misao.'+splitMessage[0].toLowerCase().replace(/[^a-z]/g, '');
	} else {
		// General channel message, so we operate a little differently
		// And yes, I'm aware how the variable names are a clusterfuck
		
		to = message.params[0];
		splitMessage = message.params[1].split(' ');
		
		if(splitMessage[0] == config.irc.nick+':') {
			// Specific to Misao-chan
			method = 'misao.'+splitMessage[1].toLowerCase().replace(/[^a-z]/g, '');
			
			// Done to remove both "bot:" and command itself
			splitMessage.shift();
			splitMessage.shift();
		} else {
			// General chatter
			method = null;
		}
		
		
	}
	
	command = method+"('"+to+"', '"+message.person.nick+"', splitMessage)";
	
	// But calling the method is the same anyway regardless
	if(method != null && typeof eval(method) == 'function') { 
		eval(command);
	} else if (method != null) {
		misao.methodNotFound(to);
	}
}

// Bot itself
function Misao() {
	
	this.help = function(to, username, message) {
		msg = 'Please visit "https://github.com/lorentzkim/misao-chan" for usage';
		this.privmsg(to, username, msg);
	}
	
	this.fortune = function(to, username, message) {
		
		msgs = [];
		
		for(i in config.fortune) {
			eval(i+' = config.fortune.'+i+'[Math.floor(Math.random()*config.fortune.'+i+'.length)];');
			msgs.push((i.slice(0,1).toUpperCase() + i.slice(1)) + ': ' + (eval(i)));
		}
		
		this.privmsg(to, username, msgs.join(' | '));
	}
	
	this.methodNotFound = function(to, username, message) {
		msg = 'Invalid command';
		this.privmsg(to, username, msg);
	}
	
	this.privmsg = function(to, username, msg) {
		if(to != username) {
			msg = username+': '+msg;
		}
		irc_instance.privmsg(to, msg, true);
	}
}