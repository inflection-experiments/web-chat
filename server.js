import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer();
const io = new Server(server, {
	cors: {
		origin: '*'
	}
});

io.on('connection', (socket) => {
	console.log('a user connected');
	// Listen for 'user join' event to receive the user's name
	socket.on('user join', (username) => {
		// Emit 'user joined' event to all connected clients with the user's name
		io.emit('user joined', `${username} joined the chat`);
	});

	socket.on('chat message', (message) => {
		io.emit('chat message', message);
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

server.listen(3000, () => {
	console.log('Server running on http://localhost:3000');
});
