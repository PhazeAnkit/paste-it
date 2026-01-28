import { Router, Request, Response } from "express";
import { pingRedis } from "../utils/redisClient";

const router = Router();
router.get("/", async (_req: Request, res: Response) => {
  if (await pingRedis()) {
    return res.status(200).json({ "ok": true });
  }
});

export default router;