const net = require('net');

const HOSTNAME = '127.0.0.1';
const PORT = 6379;

const server = net.createServer((connection) => {
	console.log('some one connected!');
});

server.listen(PORT, HOSTNAME, () => {
	console.log(`Listening at ${HOSTNAME}:${PORT}`);
});
