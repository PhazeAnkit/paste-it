import { prisma } from "../utils/dbClient";
import { v7 as uuidv7 } from "uuid";

type PasteData = {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
};

const pasteService = {
  async addMessage(content: string, ttl_seconds: number, max_views: number) {
    const id = uuidv7();

    const expiresAt =
      ttl_seconds > 0 ? new Date(Date.now() + ttl_seconds * 1000) : null;

    await prisma.pasteDB.create({
      data: {
        id,
        content,
        expiresAt,
        maxViews: max_views > 0 ? max_views : null,
      },
    });

    return id;
  },
};

export default pasteService;
