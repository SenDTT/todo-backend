import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Get all todos
app.get("/todos", async (_req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({
      success: true,
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve todos",
    });
  }
});

// Add a todo
app.post("/todos", async (req, res) => {
  const { title, color } = req.body;
  const todo = await prisma.todo.create({ data: { title, color } });
  res.json({
    success: true,
    data: todo,
  });
});

// Update a todo
app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { color, title } = req.body;
  const todo = await prisma.todo.update({
    where: { id: Number(id) },
    data: { color, title },
  });

  res.json({
    success: true,
    data: todo,
  });
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.todo.delete({ where: { id: Number(id) } });
  res.json({
    success: true,
    message: "Todo deleted",
  });
});

// Complete or not complete todo
app.patch("/todos/:id/complete", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const todo = await prisma.todo.update({
    where: { id: Number(id) },
    data: { completed },
  });
  res.json({
    success: true,
    data: todo,
  });
});

const error_handler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).json({ error: "An unknown error occurred" });
  }
};
app.use(error_handler);

app.listen(4000, () =>
  console.log("🚀 Server running on http://localhost:4000")
);
