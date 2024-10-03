let memoryLike = {
	transactions: {},
};

const transaction = {
	isEnabled: true,
	commands: [],
};

module.exports.ping = () => '+pong';

module.exports.echo = (...args) => `+${args.join(' ')}`;

module.exports.set = (...args) => {
	const key = args[1];
	const value = args[2];

	if (args[3] === 'px' && args[4]) {
		setTimeout(() => {
			console.log(`deleting ${key}`);
			delete memoryLike[key];
		}, args[4]);
	}

	memoryLike[key] = value;

	return '+OK';
};

module.exports.get = (...args) => {
	const key = args[1];

	if (memoryLike[key]) {
		return memoryLike[key];
	}

	return '-1';
};

module.exports.incr = (...args) => {
	const key = args[1];
	const value = memoryLike[key];

	// If the value stored is not a number, return immedietly
	if (value && isNaN(parseInt(value))) {
		return '-ERR value is not an integer or out of range';
	}

	// If the value stored exists for key and is a number or number pracible
	if (value && (typeof value === 'number' || !isNaN(parseInt(value)))) {
		memoryLike[key] = parseInt(value) + 1;
	} else {
		// If the value for key doesn't exists at all
		memoryLike[key] = 1;
	}

	return memoryLike[key];
};

module.exports.multi = (client, ...args) => {
	const clientId = client.id.toString();
	// Activate transaction for exec
	if (!memoryLike.transactions[clientId]) {
		memoryLike.transactions[clientId] = { ...transaction };
	} else {
		memoryLike.transactions[clientId].isEnabled = true;
	}

	return '+OK';
};

module.exports.exec = (client, ...args) => {
	const clientId = client.id.toString();
	const transaction = memoryLike.transactions[clientId];

	// If MULTI not called (transaction disabled)
	if (!transaction || !transaction.isEnabled) {
		return '-ERR EXEC without MULTI';
	}

	if (transaction.commands.length === 0) {
		memoryLike.transactions[client.id].isEnabled = false;
		return '+(empty array)';
	}

	// Execute commands in order
	// TODO: Handle rollback mechanism
	let history = [];
	let resps = [];
	while (memoryLike.transactions[clientId].commands.length !== 0) {
		// pop the last element (first stored using unshift)
		const command = memoryLike.transactions[clientId].commands.pop();
		// push to history
		history.push(command);
		// store executed orders
		resps.push(command.fn(client, ...command.args.slice(1)));
	}

	// toggle multi flag
	memoryLike.transactions[client.id].isEnabled = false;

	return '+OK' + '\r\n' + resps.join('\r\n');
};

module.exports.queueIfTransactionEnabled = (client, commandHandler, args) => {
	const clientId = client.id.toString();
	const transaction = memoryLike.transactions[clientId];
	const isExecCommand = args[0].toLocaleLowerCase() === 'exec';

	// If MULTI not called (transaction disabled) call command naturally
	if (!transaction || !transaction.isEnabled || isExecCommand) {
		return commandHandler(client, ...args.slice(1));
	}

	// Otherwise, queue command into client's transaction (FIFO)
	memoryLike.transactions[clientId].commands.unshift({
		fn: commandHandler,
		args: args,
	});
	console.log(memoryLike.transactions[clientId]);
	return '+(queued)';
};
