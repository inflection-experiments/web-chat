import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env
dotenv.config();

// Create a MySQL connection pool
const pool = mysql.createPool({
	host: process.env.host,
	user:process.env.user,
	password: process.env.password,
	database: process.env.database,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

// Create an HTTP server
const app = express();
const server = http.createServer(app);

// Create a new instance of Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
	cors: {
		origin: '*' // Allowing CORS for all origins
	}
});

// Create Redis clients for publishing and subscribing
const redisURL = process.env.REDIS_URL; // Use default if not provided
const pubClient = createClient({ url: redisURL });
const subClient = pubClient.duplicate();

let redisAdapterInitialized = false;

// Function to initialize Redis adapter
const initializeRedisAdapter = () => {
	if (!redisAdapterInitialized) {
		io.adapter(createAdapter(pubClient, subClient));
		redisAdapterInitialized = true;
	}
};

// Middleware to parse JSON in REST mode
app.use(bodyParser.json());

// API endpoint for sending messages using both REST and Socket.IO
app.post('/api/messages', async (req, res) => {
	const { username, message, room } = req.body;

	// Store the message in the MySQL database
	try {
		const connection = await pool.getConnection();
		await connection.query(
			'INSERT INTO messages (username, message, room, timestamp) VALUES (?, ?, ?, ?)',
			[username, message, room, new Date()]
		);
		connection.release();
	} catch (error) {
		console.error('Error storing message in MySQL:', error);
		res.status(500).json({ success: false, message: 'Internal server error.' });
		return;
	}

	// Check if it's a Socket.IO request
	if (req.get('Upgrade') === 'websocket') {
		// Emit the message to all connected clients
		io.emit('chat message', {
			username,
			message,
			timestamp: new Date().toLocaleString(),
			host: true,
			name: username,
			color: '',
			room
		});

		// Respond to the WebSocket connection
		res.status(200).end();
	} else {
		// It's a REST request, respond with JSON
		io.emit('chat message', {
			username,
			message,
			timestamp: new Date().toLocaleString(),
			host: true,
			name: username,
			color: '',
			room
		});

		res.status(200).json({ success: true, message: 'Message sent successfully.' });
	}
});

// Event listener for handling incoming socket connections
io.on('connection', (socket) => {
	console.log('user Joined the chat'); // Log when a user connects

	// Event listener for when a user joins the chat
	socket.on('user join', (username) => {
		// Emit a message to all clients indicating a user has joined the chat
		io.emit('user joined', `${username} joined the chat`);
	});

	// Event listener for handling chat messages
	socket.on('chat message', (message) => {
		// Emit the received chat message to all connected clients
		io.emit('chat message', message);

		// Store the message in the MySQL database
		pool.execute('INSERT INTO messages (username, message, room, timestamp) VALUES (?, ?, ?, ?)', [
			message.username,
			message.message,
			message.room,
			new Date()
		]);
	});

	// Event listener for handling disconnection of a user
	socket.on('disconnect', () => {
		console.log('user left'); // Log when a user disconnects
	});
});

// Error handling for Redis connection
pubClient.on('error', (error) => {
	console.error('Redis pubClient error:', error);
	console.log('Switching to in-memory adapter.');

	// Use the default in-memory adapter in case of Redis connection failure
	initializeRedisAdapter(); // Initialize Redis adapter if not done before
	io.adapter(null); // Use the default in-memory adapter
});

subClient.on('error', (error) => {
	console.error('Redis subClient error:', error);
	console.log('Switching to in-memory adapter.');

	// Use the default in-memory adapter in case of Redis connection failure
	initializeRedisAdapter(); // Initialize Redis adapter if not done before
	io.adapter(null); // Use the default in-memory adapter
});

// Start the HTTP server and listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

