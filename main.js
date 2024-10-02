const net = require('net');
const handleCommands = require('./commandHanlder');

const HOSTNAME = '127.0.0.1';
const PORT = 6379;

const server = net.createServer((connection) => {
	connection.id = Math.floor(Math.random() * 1000);
	console.log('some one connected with id: ' + connection.id);

	// Responding to incoming data
	connection.on('data', (data) => {
		// Parse incoming strings into buffer arrays split by any white space
		const args = Buffer.from(data).toString().trim().split(/\s+/);
		const resp = handleCommands(connection, args);
		connection.write(resp);
	});
});

server.listen(PORT, HOSTNAME, () => {
	console.log(`Listening at ${HOSTNAME}:${PORT}`);
});
