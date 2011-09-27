// Inspired by PipSqueek's Slap module
// http://code.google.com/p/pipsqueek/source/browse/trunk/lib/PipSqueek/Plugin/Slap.pm

var misaoUtil = require('../util.js');

module.id = 'slap';

exports.execute = function(msg, callback) {
	for (i in slaps) {
		eval(i + ' = slaps.' + i + '[Math.floor(Math.random()*slaps.' + i + '.length)];');
	}
	callback(verb + ' ' + misaoUtil.stripText(msg) + ' ' + area + ' with a ' + size + ' ' + tool, true);
};

var slaps = {
	verb: [ "slaps", "hits", "smashes", "beats", "bashes", "smacks", "blats", "punches", "stabs" ],
	area: [ "around the head", "viciously", "repeatedly", "in the face", "to death" ],
	size: [ "large", "huge", "small", "tiny", "miniscule", "enormous", "gargantuan", "normal" ],
	tool: [ "trout", "fork", "mouse", "bear", "piano", "cello", "vacuum", "mosquito", "sewing needle" ]
};

exports.help = "Slap something. Usage: slap something"