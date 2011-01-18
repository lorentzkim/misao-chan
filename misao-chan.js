// Config

// Load required files
var sys = require('sys'),
	path = require('path'),
	fs = require('fs'),
	config = require('./config.js'),
	irc = require('irc-js');

var irc_instance = new irc(config.irc);

irc_instance.connect(onConnect);

// Listeners

function onConnect() {
	setTimeout(function() {
		console.log('what');
		irc_instance.join('#misao-chan');
	}, 15000);
}

function pingListener() {
	console.log('ping!');
}