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
	return this.processMsg(msg).command;
}
// Gets the order, or null if there isn't an order
exports.getOrder = function(msg) {
	return this.processMsg(msg).order;
}
// Gets everything else
exports.getEverythingElse = function(msg) {
	return this.processMsg(msg).everythingElse;
}

// Strip to msg text for use in methods
// DEPRECATED in favor of getEverythingElse
exports.stripText = function(msg) {
	return this.getEverythingElse(msg);
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
	if(this.isPM(msg) || this.getOrder(msg)) {
		return true;
	}
	return false;
}

// Processes the msg object into an object intended for use in all these check functions
// Trying to consolidate some of the command detection logic
exports.processMsg = function(msg) {
	var text = msg.text[0];
	var findOrder = new RegExp("(^"+options.nick+":|^"+options.nick+",|^"+options.commandPrefix+")");
	
	try {
		var order = text.match(findOrder).pop();
	}
	catch(err) {
		console.error(err);
		return { "order": null };
	}
	
	var command = text.replace(findOrder,'').match(/\w+/).pop();
	var everythingElse = text.replace(order,'').replace(command,'').replace(/^\s*/, '');
	
	return { "order": order, "command": command, "everythingElse": everythingElse };
}
