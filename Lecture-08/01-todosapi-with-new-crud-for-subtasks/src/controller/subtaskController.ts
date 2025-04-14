import { Request, Response } from 'express';
import { db } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const fetchAllSubtasks = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM subtasks');
    return res.json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
};

export const fetchSingleSubtask = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const sql = `
    SELECT * FROM subtasks
    WHERE id = ?
    `;

    const [rows] = await db.query<RowDataPacket[]>(sql, [id]); // Using placeholder to prevent SQL injections
    const subtask = rows[0]; // Returnera bara första träffen i arrayen, ska bara finnas en

    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found.' });
    }

    return res.json(subtask);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
};

export const createSubtask = async (req: Request, res: Response) => {
  const todo_id = req.body.todo_id;
  const content = req.body.content;
  if (todo_id === undefined || content === undefined) {
    return res.status(400).json({ error: 'Content and todo_id is required' });
  }

  try {
    const sql = `
        INSERT INTO subtasks (todo_id, content)
        VALUES (?, ?)
      `;
    const [result] = await db.query<ResultSetHeader>(sql, [todo_id, content]);
    return res
      .status(201)
      .json({ message: 'Subtask created', id: result.insertId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
};

// Update
export const updateSubtask = async (req: Request, res: Response) => {
  //   const id = req.params.id;
  //   const updates: Partial<IPost> = req.body;
  //   if (!id) {
  //     return res.status(400).json({ error: 'Post not found' });
  //   }
  //   if (!updates || Object.keys(updates).length === 0) {
  //     return res
  //       .status(400)
  //       .json({ error: 'At least one field must be provided to update' });
  //   }
  //   try {
  //     const keys = Object.keys(updates) as (keyof IPost)[];
  //     const setClause = keys.map((key: keyof IPost) => `${key} = ?`).join(', ');
  //     const values = keys.map((key) => updates[key]);
  //     values.push(id);
  //     const sql = `
  //     UPDATE posts
  //     SET ${setClause}
  //     WHERE id = ?
  //     `;
  //     const [result] = await db.query<ResultSetHeader>(sql, values);
  //     if (result.affectedRows === 0) {
  //       return res.status(404).json({ message: 'Post not found' });
  //     }
  //     return res.json({ message: 'Post updated' });
  //   } catch (error: unknown) {
  //     const message = error instanceof Error ? error.message : 'Unknown error';
  //     return res.status(500).json({ error: message });
  //   }
};

// Delete
export const deleteSubtask = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const sql = `
    DELETE FROM subtasks
    WHERE id = ? 
    `;

    const [result] = await db.query<ResultSetHeader>(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    return res.json({ message: 'Subtask deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
};
