import express from 'express';
import projectsController from '../controllers/projectsController';

const router = express.Router();

router.get('/', projectsController.readAllProjects);
router.post('/', projectsController.createProject);
router.get('/:projectId', projectsController.readProject);
router.patch('/:projectId', projectsController.updateProject);
router.delete('/:projectId', projectsController.deleteProject);

export = router;