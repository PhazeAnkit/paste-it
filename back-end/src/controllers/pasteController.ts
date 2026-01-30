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
};

export default pasteController;
