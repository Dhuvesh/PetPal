import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io'; 
import AuthRoutes from './routes/auth.route.js';
import PetRoutes from './routes/pet.route.js';
import VetRoutes from './routes/vet.route.js'
import donationRoutes from './routes/donationRoutes.js'
import adoptionRoutes from './routes/adoption.route.js';
import contactRoutes from './routes/contactRoutes.js'
import ChatRoutes from './routes/chat.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
    cors: {
        origin: "https://pet-pal-five.vercel.app",
        methods: ["GET", "POST"]
    }
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/donations/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
    origin: "https://pet-pal-five.vercel.app",
    credentials: true 
}));

app.use('/api/auth', AuthRoutes);
app.use('/api/pets', PetRoutes);
app.use('/api/vet-clinics',VetRoutes)
app.use('/api/contacts', contactRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/chat', ChatRoutes);

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // --- NEW LISTENER TO JOIN ALL CHAT ROOMS ---
    socket.on('join_all_rooms', (roomIds) => {
        if (Array.isArray(roomIds)) {
            roomIds.forEach(roomId => socket.join(roomId));
            console.log(`User ${socket.id} joined multiple rooms:`, roomIds.length);
        }
    });

    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});