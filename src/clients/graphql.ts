import fetch from "node-fetch";
import { URL } from "../url";


// Helper function to make GraphQL requests
const makeGraphQLRequest = async (query: string, variables: any = {}) => {
  try {
    const response = await fetch(URL.GRAPH_QL.BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }
    return result.data;
  } catch (error) {
    console.error("GraphQL Request Error:", error);
    throw error;
  }
};

// Fetch all users
const fetchUsers = async () => {
  const query = `
    query {
      getUsers {
        id
        name
      }
    }
  `;
  const data = await makeGraphQLRequest(query);
  console.log("All Users:", data.getUsers);
};

// Fetch a user by ID
const fetchUserById = async (id: number) => {
  const query = `
    query ($id: ID!) {
      getUserById(id: $id) {
        id
        name
      }
    }
  `;
  const variables = { id };
  const data = await makeGraphQLRequest(query, variables);
  console.log(`User with ID ${id}:`, data.getUserById);
};

// Add a new user
const addUser = async (name: string) => {
  const mutation = `
    mutation ($name: String!) {
      addUser(name: $name) {
        id
        name
      }
    }
  `;
  const variables = { name };
  const data = await makeGraphQLRequest(mutation, variables);
  console.log("New User Added:", data.addUser);
};

// Delete a user by ID
const deleteUser = async (id: number) => {
  const mutation = `
    mutation ($id: ID!) {
      deleteUser(id: $id) {
        id
        name
      }
    }
  `;
  const variables = { id };
  const data = await makeGraphQLRequest(mutation, variables);
  console.log("Deleted User:", data.deleteUser);
};

// Example usage
(async () => {
  await fetchUsers(); // Fetch all users
  await fetchUserById(1); // Fetch user with ID 1
  await addUser("Alice"); // Add a new user named Alice
  await fetchUsers(); // Fetch all users again to verify the new user
  await deleteUser(2); // Delete user with ID 2
  await fetchUsers(); // Fetch all users again to verify changes
})();
