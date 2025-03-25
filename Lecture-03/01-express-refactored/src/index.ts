import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(express.json()); // Middleware för att tolka JSON
app.use(cors()); // This makes the Express server accept requests from other domains

// Routes
import postRouter from './routes/postRouter';
app.use('/posts', postRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
