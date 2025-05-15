import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 3001;

// Middleware for parsing JSON
app.use(express.json());

// Mock data
const users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
];

// Routes
app.get("/api/users", (req: Request, res: Response) => {
  res.json(users);
});

app.get("/api/users/:id", (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

app.post("/api/users", (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const newUser = { id: users.length + 1, name };
  users.push(newUser);

  res.status(201).json(newUser);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
export const startExpressServer = () => {
  app.listen(PORT, () => {
    console.log(`REST API running at http://localhost:${PORT}/api/users`);
  });
};
