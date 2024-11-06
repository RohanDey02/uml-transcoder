import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import generationRouter from "./routers/generationRouter";
import webProxyRouter from "./routers/webProxyRouter";
import uploadsRouter from "./routers/uploadsRouter";

dotenv.config({ path: ".env" });

const app: Express = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "localhost:4200",
    credentials: true,
  })
);

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
