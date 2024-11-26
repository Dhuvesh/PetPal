import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from "./routes/user.route.js  "
import authRoutes from "./routes/auth.route.js"
import petRoutes from "./routes/pet.route.js"
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();



mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB");

}).catch((err)=>{
    console.log(err);
})

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.listen(3000, ()=>{
    console.log("Server Listening on Port 3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/pet', petRoutes);
app.use('/api/uploads', express.static('uploads'));


app.use((err,req,res,next)=>{
    const statusCode= err.statusCode || 500;
    const message= err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    });
});