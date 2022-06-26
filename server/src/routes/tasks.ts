import express from 'express';
import tasksController from '../controllers/tasksController';

const router = express.Router();

router.get('/', tasksController.readAllTasks);
router.post('/', tasksController.createTask);
router.get('/:taskId', tasksController.readTask);
router.patch('/:taskId', tasksController.updateTask);
router.delete('/:taskId', tasksController.deleteTask);

export = router;