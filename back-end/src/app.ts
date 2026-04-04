import express from "express";
import path from "path";
import healthRouter from "./routes/healthCheckup";
import pasteRoutes from "./routes/pasteRoutes";

const app = express();


app.use((req,_res,next)=>{
  console.log(req);
  next();
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/healthz", healthRouter);
app.use("/api/pastes", pasteRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../front-end/dist");

  app.use(express.static(frontendPath));

  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

export default app;
