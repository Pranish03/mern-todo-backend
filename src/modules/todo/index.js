import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { createTodoSchema, editTodoSchema } from "./schema.js";
import { Todo } from "./model.js";

const todoRouter = Router();

/**
 * @DESC Creates a todo
 * @API  POST todos/
 */
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

/**
 * @DESC Edits a todo
 * @API  PUT todos/:id
 */
todoRouter.patch("/:id", validate(editTodoSchema), async (req, res) => {
  try {
    const todoId = req.params.id;

    const data = { ...req.validated };

    const todo = await Todo.findByIdAndUpdate(todoId, data, { new: true });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    return res.status(200).json({
      message: "Todo updated successfully",
      data: todo,
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { todoRouter };
