import { Router } from "express";
import pasteController from "../controllers/pasteController";

const router = Router();

router.post("/", pasteController.addMessage);
router.get("/:id", pasteController.getMessage);

export default router;
