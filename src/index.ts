// src/index.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

// Konfigurasi CORS untuk Socket.IO
// Ganti 'http://localhost:3000' dengan URL Next.js client-mu yang sebenarnya
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"], // Tambahkan URL client yang sesuai
        methods: ["GET", "POST"]
    }
});

// Middleware Express (opsional, bisa digunakan untuk REST API biasa juga)
app.get('/', (req, res) => {
    res.send('Socket.IO TypeScript server is running!');
});

// Event listener untuk koneksi Socket.IO
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Contoh: Menerima dan memancarkan pesan obrolan
    socket.on('chat-message', ({from, message}) => {
        console.log(`Message from ${from}: ${message}`);
        io.emit('chat-message', {from, message}); // Mengirim pesan ke semua klien yang terhubung
    });

    // Contoh: Menerima event kustom dari klien
    socket.on('custom event', (data: any) => {
        console.log(`Custom event received: ${JSON.stringify(data)}`);
        // Kamu bisa memancarkan kembali atau melakukan logika lain
        socket.emit('response to custom event', { status: 'received', originalData: data });
    });

    // Event saat klien terputus
    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

app.use(cors());

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket.IO server accessible at http://localhost:${PORT}`);
});