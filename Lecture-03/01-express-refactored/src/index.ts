import express, { Request, Response } from 'express';

const app = express();

app.use(express.json()); // Middleware för att tolka JSON

// Routes

import postRouter from './routes/postRouter';

app.use('/posts', postRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
