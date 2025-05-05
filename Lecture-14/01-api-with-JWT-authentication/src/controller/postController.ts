import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IPost } from '../types/IPost';
import Post from '../models/Post'; // Via denna kan man göra alla operationer

// Figure out sort and search functionality with DB
export const fetchAllPosts = async (req: Request, res: Response) => {
  try {
    res.json(await Post.find());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

export const fetchSinglePost = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    // console.log(
    //   'Post id:',
    //   id,
    //   'Valid MongoDB ObjectId:',
    //   mongoose.Types.ObjectId.isValid(id)
    // );
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid post ID.' });
      return;
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ message: 'Post not found.' });
      return;
    }

    res.json(post);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    res.status(400).json({ error: 'Title, content, and author are required' });
    return;
  }

  try {
    const newPost = new Post({
      title,
      content,
      author,
    });

    const savedPost = await newPost.save();

    res.status(201).json({ message: 'Post added', post: savedPost });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

// Update
export const updatePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const updates: Partial<IPost> = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid post ID.' });
    return;
  }

  if (!updates || Object.keys(updates).length === 0) {
    res
      .status(400)
      .json({ error: 'At least one field must be provided to update' });
    return;
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedPost) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.json({ message: 'Post updated', post: updatedPost });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

// Delete
export const deletePost = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid post ID.' });
      return;
    }

    const result = await Post.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.json({ message: 'Post deleted', deletedPost: result }); // ta ev bort deletedPost, onödigt att visa klienten
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};
