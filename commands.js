const memoryLike = {};

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
