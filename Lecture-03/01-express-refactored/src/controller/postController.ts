import { Request, Response } from 'express';
import { Post } from '../models/Post';

const posts: Post[] = [
  new Post(
    'Det ligger något i handarbetet',
    'Snart är den i land, den största svenska vetenskapliga studien hittills av hur handarbete påverkar psykisk hälsa. Hemslöjd har fått en tidig intervju med forskaren bakom, som nu har börjat analysera siffrorna.',
    'Malin Vessby'
  ),
  new Post(
    'Tjusigast på Kyrkbacken!',
    'Smuggelgods, skrytplagg och en snygg silhuett. Hör berättelsen om livstycket. Bondesamhällets egen gucciväska.',
    'Kristina Lindh'
  ),
  new Post(
    'Gör sin tröja till en vän',
    'Om tröjan tittar uppfordrande på dig kanske du behåller den längre. Det hoppas textilkonstnären Ýr Jóhannsdóttir.',
    'Maria Diedrichs'
  ),
];

export const fetchAllPosts = (req: Request, res: Response) => {
  const search = req.query.search;
  const sort = req.query.sort;

  let filteredPosts = posts;

  try {
    if (search) {
      const authorSearch = search.toString().toLowerCase();

      filteredPosts = filteredPosts.filter((p) =>
        p.author.toLowerCase().includes(authorSearch.toString())
      );
    }

    if (sort && sort === 'asc') {
      // Sorts in alphabetical order
      filteredPosts = filteredPosts.sort((a, b) => {
        const post1 = a.title.toLowerCase();
        const post2 = b.title.toLowerCase();

        if (post1 > post2) return 1; // True
        if (post1 < post2) return -1; // False
        return 0; // Equal
      });
    }

    if (sort && sort === 'desc') {
      filteredPosts = filteredPosts.sort((a, b) => {
        const post1 = a.title.toLowerCase();
        const post2 = b.title.toLowerCase();

        if (post1 < post2) return 1; // True
        if (post1 > post2) return -1; // False
        return 0; // Equal
      });
    }

    res.json(filteredPosts);
  } catch (error: unknown) {
    // Snrouterar upp fel från den externa tjänsten
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

export const fetchSinglePost = (req: Request, res: Response) => {
  const id = req.params.id;
  const post = posts.find((p) => p.id === parseInt(id));

  try {
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to retrieve post: ${message}` });
  }

  res.json({ post });
};

export const createPost = (req: Request, res: Response) => {
  const { title, content, author } = req.body;

  try {
    if (!title || !content || !author) {
      res
        .status(400)
        .json({ error: 'Title, content, and author are required' });
      return;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }

  const newPost = new Post(title, content, author);
  posts.push(newPost);
  res.status(201).json({ message: 'New post added', data: newPost });
};

export const updatePost = (req: Request, res: Response) => {
  const title = req.body.title;
  const post = posts.find((p) => p.id === parseInt(req.params.id));

  try {
    if (title === undefined) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    post.title = title;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }

  res.json({ message: 'Title updated', newTitle: title });
};

export const deletePost = (req: Request, res: Response) => {
  const id = req.params.id;
  const postIndex = posts.findIndex((p) => p.id === parseInt(id));

  try {
    if (postIndex === -1) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }

  posts.splice(postIndex, 1);
  res.json({ message: 'Post deleted' });
};
