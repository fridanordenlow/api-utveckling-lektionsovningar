import express from 'express';
import {
  fetchAllPosts,
  fetchSinglePost,
  createPost,
  updatePost,
  deletePost,
} from '../controller/postController';
import { verifyAccessToken } from '../middlewares/verifyToken';

const router = express.Router();

router.get('/', fetchAllPosts);
router.get('/:id', fetchSinglePost);

// These endpoints are protected through verification
router.post('/', verifyAccessToken, createPost);
router.patch('/:id', verifyAccessToken, updatePost);
router.delete('/:id', verifyAccessToken, deletePost);

export default router;
