//server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './src/config/index.js'; 
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/users.routes.js';
import errorHandler from './src/middlewares/error.middleware.js';


dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middeware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // لدعم البيانات المرسلة عبر النماذج

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Welcome to the Gym Management System!');
});

app.listen(port , (req , res) => {
    console.log(`Server is running on http://localhost:${port}`);
})