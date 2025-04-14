import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import postRouter from './routes/postRouter';
import { connectToDatabase } from './config/db';

const app = express();

console.log(process.env.DB_HOST);

// Middlewares
app.use(express.json()); // Middleware för att tolka JSON
app.use(cors()); // This makes the Express server accept requests from other domains

// Routes
app.use('/posts', postRouter);

// Connect to DB
connectToDatabase();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
