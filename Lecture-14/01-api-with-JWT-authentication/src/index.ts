import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import postRouter from './routes/posts';
import authRouter from './routes/auth';
import mongoose from 'mongoose';
import { verifyAccessToken } from './middlewares/verifyToken';

const app = express();

// console.log(process.env.DB_HOST);

// Middlewares
app.use(express.json()); // Middleware för att tolka JSON
app.use(cookieParser()); // Parses Cookies
app.use(
  cors({
    origin: '*', // This makes the Express server accept requests from all other domains
    credentials: true, // Allows cookies sent to this API
  })
);

// Routes
app.use('/posts', postRouter); // verifyAccessToken is a middleware we created
app.use('/auth', authRouter);

app.use(verifyAccessToken);

// Connect to DB
mongoose.connect(process.env.MONGODB_URL || '');

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
