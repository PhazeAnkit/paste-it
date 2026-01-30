import { Request, Response } from "express";
import pasteService from "../services/pasteService";

const pasteController = {
  async addMessage(req: Request, res: Response) {
    const { content, ttl_seconds, max_views } = req.body;
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const ttl = Number(ttl_seconds) || 0;
    const views = Number(max_views) || 0;

    if (!content) {
      return res.status(400).json({ error: "invalid request body" });
    }

    try {
      const id = await pasteService.addMessage(content, ttl, views);
      return res.status(200).json({
        id,
        url: `${baseUrl}/p/${id}`,
      });
    } catch (err) {
      return res.status(500).json({
        error: "internal server error",
      });
    }
  },

  async getMessage(req: Request, res: Response) {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "invalid request" });
    }

    try {
      let nowMs = Date.now();
      if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
        nowMs = Number(req.get("x-test-now-ms"));
      }

      const result = await pasteService.getMessage(id, nowMs);
      return res.status(200).json(result);
    } catch {
      return res.status(404).json({
        error: "Paste unavailable",
      });
    }
  },
};

export default pasteController;
