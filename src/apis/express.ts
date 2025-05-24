import express, { Request, Response, NextFunction } from "express";
import { URL } from "../url";

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Mock user data
const users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
];

// Route to get all users
app.get("/api/users", (req: Request, res: Response) => {
  res.json(users);
});

// Route to get a user by ID
app.get("/api/users/:id", (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

// Route to create a new user
app.post("/api/users", (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const newUser = { id: users.length + 1, name };
  users.push(newUser);

  res.status(201).json(newUser);
});

// Middleware to handle errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the Express server
export const startExpressServer = () => {
  app.listen(URL.REST.PORT, () => {
    console.log(`REST API running at: http://localhost:${URL.REST.PORT}/api/users`);
  });
};
