import express from "express";
import refreshController from "../../controllers/auth/refreshController";

const router = express.Router();

router.get('/', refreshController.refreshHandler);

export default router;