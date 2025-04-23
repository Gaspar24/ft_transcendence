/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pfalli <pfalli@student.42wolfsburg.de>     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/04/12 15:44:20 by benanredzhe       #+#    #+#             */
/*   Updated: 2025/04/23 16:34:45 by pfalli           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyFormbody from '@fastify/formbody';
import { Server } from 'socket.io';
import { GameEngine } from '../gamelogic/GameEngine.ts';

import DB from '../data_controller/dbConfig.js';
import hasPassword from '../crypto/crypto.js';

// --- Calculate __dirname equivalent for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Load SSL certificates for HTTPS ---
const keyPath = path.join(__dirname, 'ssl/key.pem');
const certPath = path.join(__dirname, 'ssl/cert.pem');
const key = fs.readFileSync(keyPath);
const cert = fs.readFileSync(certPath);

// --- Create Fastify instance with HTTPS ---
const app = fastify({
    https: { key, cert },
    logger: false
});

// --- Register Fastify plugins ---
app.register(fastifyFormbody); // For parsing form data
app.register(fastifyStatic, { // For serving static files (HTML, CSS, client-side JS)
    root: path.join(__dirname, '../public'),
    prefix: '/',
});

// --- Initialize Socket.IO server using Fastify's HTTP server ---
const io = new Server(app.server, {
    cors: { origin: '*' } // Allow connections from any origin
});

// --- Initialize Game Engine ---
const game = new GameEngine();

// --- Handle WebSocket connections ---
io.on('connection', (socket) => {
    console.log('Secure player connected:', socket.id);

    // Example: Handle player movement input
    socket.on('player_move', ({ playerId, direction }) => {
        game.handlePlayerInput(playerId, direction);
    });

    // Add other socket event listeners here
});

// --- Game loop: Update game state and broadcast periodically ---
setInterval(() => {
    game.update(0.016); // Update game logic (assuming 60 updates per second)
    const state = game.getState(); // Get the current state
    io.emit('state_update', state); // Send state to all connected clients
}, 16); // Approximately 60 times per second

// --- HTTP API Routes ---

// Example: Get all data from credentialsTable (for testing/admin?)
app.get('/data', async (req, reply) => {
    try {
        const tables = await DB('credentialsTable');
        reply.send(tables);
    } catch (e) {
        console.error(e);
        reply.status(500).send({ error: 'Failed to retrieve data' });
    }
});

// Serve static HTML pages for specific routes
app.get('/signUp', (req, reply) => {
    reply.sendFile('signUp.html');
});

app.get('/logIn', (req, reply) => {
    reply.sendFile('login.html');
});

// Handle user sign-up requests
app.post('/signUp', async (req, reply) => {
    // Type assertion for request body
    const body = req.body as { username?: string; email?: string; password?: string };
    const { username, email } = body;
    let { password } = body;

    if (!username || !email || !password) {
        reply.status(400).send({ error: 'All fields (username, email, password) are required' });
        return;
    }

    try {
        const existingUser = await DB('credentialsTable').where({ email }).first();
        if (existingUser) {
            reply.status(409).send({ error: 'Email already exists' });
            return;
        }

        password = hasPassword(password); // Hash the password before storing
        const [id] = await DB('credentialsTable').insert({ username, email, password });

        reply.status(201).send({ success: true, id: id });
    } catch (e) {
        console.error('Sign up error:', e);
        reply.status(500).send({ error: 'Failed to insert data' });
    }
});

// Handle user login requests
app.post('/logIn', async (req, reply) => {
    const body = req.body as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
        reply.status(400).send({ error: 'Email and password are required' });
        return;
    }

    try {
        const user = await DB('credentialsTable').where({ email }).first();

        if (!user) {
            reply.status(404).send({ error: 'User not found' });
            return;
        }

        // Compare hashed password from DB with hash of provided password
        if (user.password !== hasPassword(password)) {
            reply.status(401).send({ error: 'Invalid password' });
            return;
        }

        reply.send({ success: true, message: 'Login successful', userId: user.id });
    } catch (error) {
        console.error('Login error:', error);
        reply.status(500).send({ error: 'An error occurred during login' });
    }
});

// --- Start the Server ---
const PORT = 3000;
const start = async () => {
    try {
        // Listen on all network interfaces
        await app.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`✅ Secure Server (HTTP & WebSocket) running at https://localhost:${PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1); // Exit if server fails to start
    }
};

start(); // Run the server start function