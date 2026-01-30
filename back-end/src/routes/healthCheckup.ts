import { Router, Request, Response } from "express";
import { pingRedis } from "../utils/redisClient";
import { prisma } from "../utils/dbClient";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  let dbOk = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const healthy = dbOk;

  return res.status(healthy ? 200 : 503).json({
    ok: healthy,
    services: {
      database: dbOk ? "up" : "down",
    },
  });
});

export default router;
