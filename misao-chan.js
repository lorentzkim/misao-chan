// Config

// Load required files
var sys = require('sys'),
	path = require('path'),
	fs = require('fs'),
	config = require('./config.js'),
	jerk = require('jerk'),
	mongoose = require('mongoose/').Mongoose,
	db = mongoose.connect('mongodb://localhost/misao');

var misao = new Misao();
var options = config.irc;

// Listeners

jerk(function(j) {
	j.watch_for(listenRegex('fortune'), function(message) {
		message.say(misao.fortune(message));
	});
	
	j.watch_for(listenRegex('choose'), function(message) {
		message.say(misao.choose(message));
	});
	
	j.watch_for(listenRegex('help'), function(message) {
		message.say(misao.help(message));
	});
}).connect(options);

// Create regex obj for listening
function listenRegex(listenString) {
	return new RegExp("^"+options.nick+": "+listenString+"($|\\s)");
}

// Strip message text for use in methods
function stripText(text) {
	regex = new RegExp("^"+options.nick+": \\w+($|\\s)");
	return text.replace(regex, '');
}

// Bot itself
function Misao() {
	
	this.help = function(message) {
		return this._padName(message, 'Please visit "https://github.com/lorentzkim/misao-chan" for usage');
	}
	
	this.fortune = function(message) {
		msgs = [];		
		for(i in config.fortune) {
			eval(i+' = config.fortune.'+i+'[Math.floor(Math.random()*config.fortune.'+i+'.length)];');
			msgs.push((i.slice(0,1).toUpperCase() + i.slice(1)) + ': ' + (eval(i)));
		}
		
		return this._padName(message, msgs.join(' | '));
	}
	
	this.tell = function(message) {
		
		
	}
	
	this.choose = function(message) {
		text = stripText(message.text[0]);
		choices = text.split(' or ');
		
		if(choices.length == 1) {
			msg = 'Make a proper choice, mau mau~';
			
		} else {
			msg = 'I choose... "'+choices[Math.floor(Math.random()*choices.length)]+'"';
		}
		
		return this._padName(message, msg);
	}
	
	this.methodNotFound = function(message) {
		return 'Invalid command, mau mau~';
	}
	
	this._padName = function(message, result) {
		return message.user+': '+result;
	}
}