import express from "express";
import healthRouter from "./routes/healthCheckup";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/healthz", healthRouter);

export default app;
