import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";

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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
