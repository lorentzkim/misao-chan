exports.irc = {
	server: 'localhost',
	port: 6667,
	encoding: 'utf-8',
	nick: 'Misao-chan',
	user: {
		username: 'Misao-chan',
		realname: 'Misao-chan (BOT)',
	},
	channels: ['#misao-chan']
};

exports.mongodb = 'mongodb://localhost/misao';

exports.filesystem = {
	modulesPath: '/home/misao/modules'
};

exports.startup = {
	modules: ['choose', 'tell', 'fortune', 'help']
};

exports.admins = ['lorentz'];
