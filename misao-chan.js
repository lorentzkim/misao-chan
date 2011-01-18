// Config

// Load required files
var sys = require('sys'),
	path = require('path'),
	fs = require('fs'),
	config = require('./config.js'),
	irc = require('irc-js');

var irc_instance = new irc(config.irc);

irc_instance.addListener('privmsg', privmsgListener);
irc_instance.connect(onConnect);

// Listeners

function onConnect() {
	setTimeout(function() {
		irc_instance.join('#misao-chan');
	}, 15000);
}

function privmsgListener(message) {
	if(message.params[0] == config.irc.nick && message.params[1] == 'help') {
		msg = 'Please visit "https://github.com/lorentzkim/misao-chan" for usage';
		irc_instance.privmsg(message.person.nick, msg, true);
	}
}