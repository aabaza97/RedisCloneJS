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
	const key = args[0];
	const value = args[1];

	if (args[2] === 'px' && args[3]) {
		setTimeout(() => {
			console.log(`deleting ${key}`);
			delete memoryLike[key];
		}, args[3]);
	}

	memoryLike[key] = value;

	return '+OK';
};

module.exports.get = (...args) => {
	const key = args[0];

	if (memoryLike[key]) {
		return memoryLike[key];
	}

	return '-1';
};

module.exports.incr = (...args) => {
	const key = args[0];
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
	console.log(memoryLike);
	// If MULTI not called (transaction disabled)
	if (!transaction || !transaction.isEnabled) {
		return '-ERR EXEC without MULTI';
	}

	if (transaction.commands.length === 0) {
		memoryLike.transactions[client.id].isEnabled = false;
		return '(empty array)';
	}

	// TODO: Execute commands in order
	return '+OK';
};
