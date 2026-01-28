import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import http from "http";
import { connectRedis, closeRedis } from "./utils/redisClient";

const PORT = process.env.PORT || 4000;

let server: http.Server;
let shuttingDown = false;

const startServer = async (): Promise<void> => {
  try {
    await connectRedis();

    server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup Error:", err);
    process.exit(1);
  }
};

startServer();

const shutdown = async (signal: string): Promise<void> => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`Shutdown initiated (${signal})`);

  try {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log("HTTP server closed");
          resolve();
        });
      });
    }

    await closeRedis();
    console.log("Redis disconnected");
  } catch (err) {
    console.error("Shutdown error:", err);
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("SIGQUIT", shutdown);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  shutdown("unhandledRejection");
});
