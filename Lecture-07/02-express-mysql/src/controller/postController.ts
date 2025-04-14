import { Request, Response } from 'express';
// import { Post } from '../models/Post';
import { db } from '../config/db';
import { IPost } from '../models/IPost';
import { ResultSetHeader } from 'mysql2';

// const posts: Post[] = [
//   new Post(
//     'Det ligger något i handarbetet',
//     'Snart är den i land, den största svenska vetenskapliga studien hittills av hur handarbete påverkar psykisk hälsa. Hemslöjd har fått en tidig intervju med forskaren bakom, som nu har börjat analysera siffrorna.',
//     'Malin Vessby'
//   ),
//   new Post(
//     'Tjusigast på Kyrkbacken!',
//     'Smuggelgods, skrytplagg och en snygg silhuett. Hör berättelsen om livstycket. Bondesamhällets egen gucciväska.',
//     'Kristina Lindh'
//   ),
//   new Post(
//     'Gör din tröja till en vän',
//     'Om tröjan tittar uppfordrande på dig kanske du behåller den längre. Det hoppas textilkonstnären Ýr Jóhannsdóttir.',
//     'Maria Diedrichs'
//   ),
// ];

// Figure out sort and search functionality with DB
export const fetchAllPosts = async (req: Request, res: Response) => {
  // const search = req.query.search;
  // const sort = req.query.sort;

  // let filteredPosts = posts;

  // if (search) {
  //   const searchQuery = search.toString().toLowerCase();

  //   filteredPosts = filteredPosts.filter(
  //     (p) =>
  //       p.title.toLowerCase().includes(searchQuery) ||
  //       p.content.toLowerCase().includes(searchQuery) ||
  //       p.author.toLowerCase().includes(searchQuery)
  //   );
  // }

  // if (sort && sort === 'asc') {
  //   // Sorts in alphabetical order
  //   filteredPosts = filteredPosts.sort((a, b) => {
  //     const post1 = a.title.toLowerCase();
  //     const post2 = b.title.toLowerCase();

  //     if (post1 > post2) return 1; // True
  //     if (post1 < post2) return -1; // False
  //     return 0; // Equal
  //   });
  // }

  // if (sort && sort === 'desc') {
  //   filteredPosts = filteredPosts.sort((a, b) => {
  //     const post1 = a.title.toLowerCase();
  //     const post2 = b.title.toLowerCase();

  //     if (post1 < post2) return 1; // True
  //     if (post1 > post2) return -1; // False
  //     return 0; // Equal
  //   });
  // }

  try {
    // Start working with MySQL through db-variable
    //  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM posts');
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
