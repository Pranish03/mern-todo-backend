import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { createTodoSchema } from "./schema.js";
import { Todo } from "./model.js";

const todoRouter = Router();

todoRouter.post("/", validate(createTodoSchema), async (req, res) => {
  try {
    const data = req.validated;

    const todo = await Todo.create(data);

    return res.status(201).json({
      message: "Todo created successfully",
      data: todo,
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { todoRouter };
