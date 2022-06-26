import express from 'express';
import usersController from '../controllers/usersController';

const router = express.Router();

router.get('/', usersController.readAllUsers);
router.get('/:userId', usersController.readUser);
router.patch('/:userId', usersController.updateUser);
router.delete('/:userId', usersController.deleteUser);

export = router;