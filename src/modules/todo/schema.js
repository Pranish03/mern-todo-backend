import { z } from "zod";

export const createTodoSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  isComplete: z.boolean().optional().default(false),
});
