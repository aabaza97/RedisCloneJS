const net = require('net');

const HOSTNAME = '127.0.0.1';
const PORT = 6379;

const server = net.createServer((connection) => {
	console.log('some one connected!');

	// Responding to incoming data
	connection.on('data', (data) => {
		if (data.toString().toLocaleLowerCase() === 'ping\r\n') {
			connection.write('+PONG\r\n');
		} else {
			connection.write('Unknown command\r\n');
		}
	});
});

server.listen(PORT, HOSTNAME, () => {
	console.log(`Listening at ${HOSTNAME}:${PORT}`);
});
