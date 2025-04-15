import { Request, Response } from 'express';
import { db } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
// import { ITodo } from '../models/ITodo';
import { ITodoDBResponse } from '../models/ITodoDBResponse';

/**
 * Part of the exercise to figure search and sort functionality out on your own
 */
export const fetchAllTodos = async (req: Request, res: Response) => {
  const search = req.query.search;
  const sort = req.query.sort;
  // let filteredTodos = todos;

  console.log(search, sort);
  let sql = 'SELECT * FROM todos';
  let params: any = [];
  let searchSQL = '';
  let sortSQL = '';

  try {
    if (search) {
      searchSQL = 'WHERE content LIKE ?';
      params = [`%${search}%`];
    }
    if (sort) {
      // ? is either ASC or DESC
      const orderBy = sort === 'desc' ? 'DESC' : 'ASC';
      sortSQL = 'ORDER BY content' + orderBy;
    }

    sql = sql + searchSQL + sortSQL;

    // const [rows] = await db.query<ITodo[]>('SELECT * FROM todos')
    const [rows] = await db.query<RowDataPacket[]>(sql, params);
    res.json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

export const fetchTodo = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const sql = `
      SELECT 
        todos.id AS todo_id,
        todos.content AS todo_content,
        todos.done AS todo_done,
        todos.created_at AS todo_created_at,
        subtasks.id AS subtask_id,
        subtasks.todo_id AS subtask_todo_id,
        subtasks.content AS subtask_content,
        subtasks.done AS subtask_done,
        subtasks.created_at AS subtask_created_at
      FROM todos
      LEFT JOIN subtasks ON todos.id = subtasks.todo_id
      WHERE todos.id = ?
    `;
    const [rows] = await db.query<ITodoDBResponse[]>(sql, [id]);
    const todo = rows[0];
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    res.json(formatTodo(rows));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

const formatTodo = (rows: ITodoDBResponse[]) => ({
  id: rows[0].todo_id,
  content: rows[0].todo_content,
  done: rows[0].todo_done,
  created_at: rows[0].todo_created_at,
  subtasks: rows.map((row) => ({
    id: row.subtask_id,
    todo_id: row.subtask_todo_id,
    content: row.subtask_content,
    done: row.subtask_done,
    created_at: row.subtask_created_at,
  })),
});

export const createTodo = async (req: Request, res: Response) => {
  const content = req.body.content;
  if (content === undefined) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }

  try {
    const sql = `
      INSERT INTO todos (content)
      VALUES (?)
    `;
    const [result] = await db.query<ResultSetHeader>(sql, [content]);
    res.status(201).json({ message: 'Todo created', id: result.insertId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

/**
 * Part of the exercise to figure updateTodo out on your own
 */

export const updateTodo = (req: Request, res: Response) => {
  // const {content, done} = req.body // Destructur JS Object
  // if (content === undefined || done === undefined) {
  //   res.status(400).json({error: 'Content and Done are required'})
  //   return
  // }
  // const todo = todos.find((t) => t.id === parseInt(req.params.id))
  // if (!todo) {
  //   res.status(404).json({error: 'Todo not found'})
  //   return;
  // }
  // todo.content = content;
  // todo.done = done;
  // res.json({message: 'Todo updated', data: todo})
};

export const deleteTodo = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const sql = `
      DELETE FROM todos
      WHERE id = ?
    `;
    const [result] = await db.query<ResultSetHeader>(sql, [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    res.json({ message: 'Todo deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};
