import express from 'express';
import {
  fetchAllSubtasks,
  fetchSingleSubtask,
  createSubtask,
  updateSubtask,
  deleteSubtask,
} from '../controller/subtaskController';

const router = express.Router();

router.get('/', fetchAllSubtasks);
router.get('/:id', fetchSingleSubtask);
router.post('/', createSubtask);
router.patch('/:id', updateSubtask);
router.delete('/:id', deleteSubtask);

export default router;
