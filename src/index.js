import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { todoRouter } from "./modules/todo/index.js";

const app = express();
dotenv.config();

app.use(express.json());

app.use("/todos", todoRouter);

app.get("/", (req, res) => res.send("Hello World!"));

connectDB(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
});
