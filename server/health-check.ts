import { storage } from "./storage";

export async function healthCheck() {
  try {
    // Test memory storage by creating a test user
    const testUser = {
      username: "test-user",
      password: "hashed-password",
      role: "student" as const,
      fullName: "Test User",
      email: "test@example.com",
      universityId: "S-99999",
    };

    // Test creating a user
    const user = await storage.createUser(testUser);
    console.log("✓ Memory storage working - User created with ID:", user.id);

    // Test retrieving the user
    const retrievedUser = await storage.getUser(user.id);
    if (retrievedUser) {
      console.log("✓ Memory storage working - User retrieved successfully");
    } else {
      console.log("✗ Memory storage issue - User not found");
    }

    // Test retrieving by university ID
    const userByUniversityId = await storage.getUserByUniversityId("S-99999");
    if (userByUniversityId) {
      console.log("✓ Memory storage working - User found by university ID");
    } else {
      console.log("✗ Memory storage issue - User not found by university ID");
    }

    return true;
  } catch (error) {
    console.log("✗ Health check failed:", error);
    return false;
  }
}