module.exports.ping = () => '+pong';

module.exports.echo = (...args) => `+${args.join(' ')}`;
