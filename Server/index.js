import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import AuthRoutes from './routes/auth.route.js';
import PetRoutes from './routes/pet.route.js';
import VetRoutes from './routes/vet.route.js'
import contactRoutes from './routes/contactRoutes.js'
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true 
}));

app.use('/api/auth', AuthRoutes);
app.use('/api/pets', PetRoutes);
app.use('/api/vet-clinics',VetRoutes)
app.use('/api/contacts', contactRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});