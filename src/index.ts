import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Get all todos
// GET /todos?limit=10&page=2
app.get("/todos", async (req, res) => {
  try {
    const limitRaw = (req.query.limit as string) ?? "10";
    const pageRaw  = (req.query.page as string) ?? "1";

    const limit = Math.min(Math.max(parseInt(limitRaw, 10) || 10, 1), 100);
    const page  = Math.max(parseInt(pageRaw, 10) || 1, 1);
    const skip  = (page - 1) * limit;

    const [total, todos] = await Promise.all([
      prisma.todo.count(),
      prisma.todo.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.json({
      success: true,
      data: todos,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to retrieve todos" });
  }
});

// get a todo
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.findUnique({ where: { id: Number(id) } });
  if (todo) {
    res.json({
      success: true,
      data: todo,
    });
  } else {
    res.status(404).json({
      success: false,
      error: "Todo not found",
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
