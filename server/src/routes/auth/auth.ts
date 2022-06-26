import express from "express";
import authController from "../../controllers/auth/authController";

const router = express.Router();

router.post('/', authController.loginHandler);

export default router;