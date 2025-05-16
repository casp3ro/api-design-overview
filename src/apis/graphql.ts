import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3002;

// Mock user data
let users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
];

// GraphQL schema definition
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
  }

  type Query {
    getUsers: [User!]!          # Fetch all users
    getUserById(id: ID!): User  # Fetch a user by ID
  }

  type Mutation {
    addUser(name: String!): User!  # Add a new user
    deleteUser(id: ID!): User      # Delete a user by ID
  }
`;

// Resolver functions for handling GraphQL operations
const resolvers = {
  Query: {
    getUsers: () => users, // Return all users
    getUserById: (_: any, args: { id: number }) => {
      const user = users.find((u) => u.id == args.id);
      if (!user) {
        throw new Error(`User with ID ${args.id} not found`);
      }
      return user;
    },
  },
  Mutation: {
    addUser: (_: any, args: { name: string }) => {
      if (!args.name || args.name.trim().length === 0) {
        throw new Error("Name is required and cannot be empty");
      }
      const newUser = { id: users.length + 1, name: args.name };
      users.push(newUser);
      return newUser;
    },
    deleteUser: (_: any, args: { id: number }) => {
      const userIndex = users.findIndex((u) => u.id == args.id);
      if (userIndex === -1) {
        throw new Error(`User with ID ${args.id} not found`);
      }
      const deletedUser = users.splice(userIndex, 1)[0];
      return deletedUser;
    },
  },
};

// Initialize Apollo Server with schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo Server and attach it to the Express app
const startApolloServer = async () => {
  await server.start();
  app.use("/graphql", bodyParser.json(), expressMiddleware(server));
};

// Start the Express server for GraphQL API
export const startGraphQLServer = async () => {
  await startApolloServer();
  app.listen(PORT, () => {
    console.log(`GraphQL API running at http://localhost:${PORT}/graphql`);
  });
};
