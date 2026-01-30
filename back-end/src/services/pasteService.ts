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

  async getMessage(id: string, nowMs: number) {
    const now = new Date(nowMs);

    const paste = await prisma.pasteDB.findUnique({
      where: { id },
    });

    if (!paste) {
      throw new Error("Paste unavailable");
    }

    if (paste.expiresAt && paste.expiresAt <= now) {
      throw new Error("Paste unavailable");
    }

    if (paste.maxViews !== null && paste.viewsCount >= paste.maxViews) {
      throw new Error("Paste unavailable");
    }

    const updated = await prisma.pasteDB.update({
      where: { id },
      data: {
        viewsCount: { increment: 1 },
      },
    });

    return {
      content: updated.content,
      remaining_views:
        updated.maxViews === null
          ? null
          : Math.max(updated.maxViews - updated.viewsCount, 0),
      expires_at: updated.expiresAt?.toISOString() ?? null,
    };
  },
};

export default pasteService;
