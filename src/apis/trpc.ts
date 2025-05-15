import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

// Mock data
let users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
];

// tRPC Router
const appRouter = t.router({
  // Query to fetch all users
  getUsers: t.procedure.query(() => {
    return users;
  }),

  // Query to fetch a user by ID
  getUserById: t.procedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const user = users.find((u) => u.id === input.id);
      if (!user) {
        throw new Error(`User with ID ${input.id} not found`);
      }
      return user;
    }),

  // Mutation to add a new user
  addUser: t.procedure
    .input(z.object({ name: z.string().min(1, "Name is required") }))
    .mutation(({ input }) => {
      const newUser = { id: users.length + 1, name: input.name };
      users.push(newUser);
      return newUser;
    }),

  // Mutation to delete a user by ID
  deleteUser: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const userIndex = users.findIndex((u) => u.id === input.id);
      if (userIndex === -1) {
        throw new Error(`User with ID ${input.id} not found`);
      }
      const deletedUser = users.splice(userIndex, 1)[0];
      return deletedUser;
    }),
});

export type AppRouter = typeof appRouter;

const app = express();
const PORT = 3003;

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

export const startTRPCServer = () => {
  app.listen(PORT, () => {
    console.log(`tRPC API running at http://localhost:${PORT}/trpc`);
  });
};
