import app from "./app";
import http from "http";
import dotenv from "dotenv";
import { connectRedis, closeRedis } from "./utils/redisClient";

dotenv.config();

const PORT = process.env.PORT || 4000;
let server: http.Server;
const startServer = async (): Promise<void> => {
  try {
    await connectRedis();
    server = app.listen(PORT, () => {
      console.log(
        `Server is open on ${PORT} and running on  http://localhost:${PORT}`,
      );
    });
  } catch (err: unknown) {
    console.error("Startup Error:", err);
    process.exit(1);
  }
};

startServer();

const shutdown = async (signal: string): Promise<void> => {
  console.log(`${signal} received `);
  if (server) {
    server.close(() => {
      console.log("Server Closed");
    });
  }

  try {
    await closeRedis();
    console.log("Redis disconnected");
  } catch (err: unknown) {
    console.error("Redis close error", err);
  }

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("SIGQUIT", shutdown);

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (rea: unknown) => {
  console.error("Unhandled Rejection:", rea);
  shutdown("unhandlesRejection");
});
