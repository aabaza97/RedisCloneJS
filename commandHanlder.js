const commands = require('./commands.js');

const handleCommands = (connection, args) => {
	// Loging incoming parsed args
	console.log(args);

	// Normalizing commands to lowercase for later checking
	const command = args[0].toLocaleLowerCase();

	// Getting command handler from commands object
	const commandHandler = commands[command];

	// Responding to incoming command
	let response = '-Unknown command';
	if (commandHandler) {
		if (command === 'multi' || 'exec') {
			response = commandHandler(connection, ...args.slice(1));
		} else {
			response = commandHandler(...args.slice(1));
		}
	}
	return (response + '\r\n').toUpperCase();
};

module.exports = handleCommands;
