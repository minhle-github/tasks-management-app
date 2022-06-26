import express from "express";
import registerController from "../../controllers/auth/registerController";

const router = express.Router();

router.post('/', registerController.createUser);

export default router;