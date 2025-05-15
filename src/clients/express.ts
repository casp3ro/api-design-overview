import fetch from "node-fetch";

const BASE_URL = "http://localhost:3001/api/users";

// Fetch all users
const fetchUsers = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("All Users:", data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

// Fetch a user by ID
const fetchUserById = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(
        `Error fetching user with ID ${id}: ${response.statusText}`
      );
    }
    const data = await response.json();
    console.log(`User with ID ${id}:`, data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

// Add a new user
const addUser = async (name: string) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error(`Error adding user: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("New User Added:", data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

// Example usage
(async () => {
  await fetchUsers(); // Fetch all users
  await fetchUserById(1); // Fetch user with ID 1
  await addUser("Alice"); // Add a new user named Alice
})();
