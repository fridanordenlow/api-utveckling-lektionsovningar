import express from 'express';
import {
  fetchAllPosts,
  fetchSinglePost,
  createPost,
  updatePost,
  deletePost,
} from '../controller/postController';

const router = express.Router();

router.get('/', fetchAllPosts);
router.get('/:id', fetchSinglePost);
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
