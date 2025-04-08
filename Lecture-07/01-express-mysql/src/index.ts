import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

console.log(process.env.DB_HOST);

// Middlewares
app.use(express.json()); // Middleware för att tolka JSON
app.use(cors()); // This makes the Express server accept requests from other domains

import mysql from 'mysql2/promise';

// Create the connection pool. The pool-specific settings are the defaults
const db = mysql.createPool({
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  database: process.env.DB_NAME || '',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306'), // fixa till förväntad datatyp, parseInt gör om till ett nummer
});

const connectToDatabase = async () => {
  try {
    await db.getConnection();
    console.log('Connected to database.');
  } catch (error: unknown) {
    console.log('Error connecting to database:' + error);
  }
};

// Routes
import postRouter from './routes/postRouter';
app.use('/posts', postRouter);

connectToDatabase();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
