import { Request, Response } from 'express';
import { db } from '../config/db';
import { IPost } from '../models/IPost';
import { ResultSetHeader } from 'mysql2';

export const fetchAllPosts = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<IPost[]>('SELECT * FROM posts');
    return res.json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
};

export const fetchSinglePost = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const sql = `
    SELECT * FROM posts
    WHERE id = ?
    `;
    // Inte säkert sätt, ger möjlighet för SQL injections från användare
    // const sql = `
    // SELECT * FROM posts
    // WHERE id = ${id}
    // `;
    const [rows] = await db.query<IPost[]>(sql, [id]); // Using placeholder to prevent SQL injections
    const post = rows[0]; // Returnera bara första träffen i arrayen, ska bara finnas en

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    return res.json(post);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res
      .status(400)
      .json({ error: 'Title, content, and author are required' });
  }

  try {
    const sql = `
    INSERT INTO posts (title, content, author)
    VALUES (?, ?, ?)
    `;
    const [result] = await db.query<ResultSetHeader>(sql, [
      title,
      content,
      author,
    ]);
    return res.status(201).json({ message: 'Post added', id: result.insertId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
};

// Update
export const updatePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const updates: Partial<IPost> = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Post not found' });
  }

  if (!updates || Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ error: 'At least one field must be provided to update' });
  }

  try {
    const keys = Object.keys(updates) as (keyof IPost)[];
    const setClause = keys.map((key: keyof IPost) => `${key} = ?`).join(', ');
    const values = keys.map((key) => updates[key]);
    values.push(id);

    const sql = `
    UPDATE posts 
    SET ${setClause}
    WHERE id = ?
    `;

    const [result] = await db.query<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json({ message: 'Post updated' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
};

// Delete
export const deletePost = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const sql = `
    DELETE FROM posts
    WHERE id = ? 
    `;

    const [result] = await db.query<ResultSetHeader>(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.json({ message: 'Post deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
};
