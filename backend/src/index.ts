import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import rateLimit from "express-rate-limit";
import generationRouter from "./routers/generationRouter";
import webProxyRouter from "./routers/webProxyRouter";
import uploadsRouter from "./routers/uploadsRouter";

dotenv.config({ path: ".env" });

const app: Express = express();

app.use(bodyParser.json());
app.use(express.static('uploads'));
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}))

const port = process.env.PORT ?? 8080;

app.get("/", (_req, res) => {
  res.send("Welcome to the UML <=> SQL DDL Converter API!");
}); 

app.use("/api/v1/import", webProxyRouter);
app.use("/api/v1/generate", generationRouter);
app.use("/api/v1/upload", uploadsRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
