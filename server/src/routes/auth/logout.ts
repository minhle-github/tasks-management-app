import express from "express";
import logoutController from "../../controllers/auth/logoutController";

const router = express.Router();

router.get('/', logoutController.logoutHandler);

export default router;