import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    isComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const Todo = mongoose.model("Todo", todoSchema);
