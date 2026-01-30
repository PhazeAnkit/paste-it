import express from "express";
import healthRouter from "./routes/healthCheckup";
import pasteRoutes from "./routes/pasteRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/healthz", healthRouter);
app.use("/api/pastes", pasteRoutes);

export default app;
