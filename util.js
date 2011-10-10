var config = require('./config.js');

options = config.irc;

// Makes sure trigger is correct
exports.check = function(command, msg) {
	if(this.isForMisao(msg) && this.getCommand(msg) == command && this.isAdmin(msg.user)) {
		return true;
	}
	return false;
}

// Checks whether user is an admin, that is, can configure the bot
exports.isAdmin = function(username) {
	for(i = 0; i < config.admins.length; i++) {
		if(config.admins[i] == username) {
			return true;
		}
	}
	return false;
}

// Specifically gets the command/module part of the msg
exports.getCommand = function(msg) {
	if(msg.text.length == 0) {
		return null;
	}

	text = msg.text[0];
	words = text.split(' ');
	command = '';
	
	if(words[0].match(new RegExp("(^"+options.nick+",|^"+options.nick+":)"))) {
		command = words[1];
	}
	else if(words[0].match(new RegExp("^"+options.commandPrefix+"\\w+"))) {
		command = words[0].replace(options.commandPrefix,'');
	}
	else {
		command = words[0];
	}
	
	if (command == undefined) {
		return false;
	}

	return command.replace(/[^a-z\-0-9]/, '');
}

// Strip to msg text for use in methods
exports.stripText = function(msg) {
	text = msg.text[0];
	if(this.isPM(msg)) {
		regex = new RegExp("^\\w+($|\\s)");
	}
	else {
		regex = new RegExp("^"+options.nick+": \\w+($|\\s)");
	}
	return text.replace(regex, '');
}

// Adds a user name to the reply, for ease of use
exports.padName = function(msg, result) {
	return msg.user+': '+result;
}

// Bookends codes to perform a /me action & strips user name
exports.makeAction = function(msg, result) {
	return '\001ACTION ' + result.replace(new RegExp('^' + msg.user + ':'), '') + '\001';
}

// If this message is coming in from PM
exports.isPM = function(msg) {
	if(msg.user == msg.source) return true;
	return false;
}

// If this message is really for the bot
exports.isForMisao = function(msg) {
	if(this.isPM(msg) || msg.text[0].match(new RegExp("(^"+options.nick+":|^"+options.nick+",)")) || msg.text[0].match(new RegExp("^"+options.commandPrefix+"\\w+"))) {
		return true;
	}
	return false;
}
