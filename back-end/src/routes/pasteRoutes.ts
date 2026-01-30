import { Router } from "express";
import pasteController from "../controllers/pasteController";

const router = Router();

router.post("/", pasteController.addMessage);

export default router;
