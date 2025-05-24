import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../apis/trpc";
import { URL } from "../url";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: URL.TRPC.BASE,
    }),
  ],
});

// Fetch all users
const fetchUsers = async () => {
  try {
    const users = await client.getUsers.query();
    console.log("All Users:", users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Fetch a user by ID
const fetchUserById = async (id: number) => {
  try {
    const user = await client.getUserById.query({ id });
    console.log(`User with ID ${id}:`, user);
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
  }
};

// Add a new user
const addUser = async (name: string) => {
  try {
    const newUser = await client.addUser.mutate({ name });
    console.log("New User Added:", newUser);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Delete a user by ID
const deleteUser = async (id: number) => {
  try {
    const deletedUser = await client.deleteUser.mutate({ id });
    console.log("Deleted User:", deletedUser);
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
  }
};

// Example usage
(async () => {
  await fetchUsers(); // Fetch all users
  await fetchUserById(1); // Fetch user with ID 1
  await addUser("Alice"); // Add a new user named Alice
  await deleteUser(1); // Delete user with ID 1
  await fetchUsers(); // Fetch all users again to verify changes
})();
