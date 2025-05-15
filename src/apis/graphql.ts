import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3002;

// Mock data
let users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
];

// GraphQL schema
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
  }

  type Query {
    getUsers: [User!]!
    getUserById(id: ID!): User
  }

  type Mutation {
    addUser(name: String!): User!
    deleteUser(id: ID!): User
  }
`;

// Resolvers
const resolvers = {
  Query: {
    getUsers: () => users,
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  app.use("/graphql", bodyParser.json(), expressMiddleware(server));
};

export const startGraphQLServer = async () => {
  await startApolloServer();
  app.listen(PORT, () => {
    console.log(`GraphQL API running at http://localhost:${PORT}/graphql`);
  });
};
