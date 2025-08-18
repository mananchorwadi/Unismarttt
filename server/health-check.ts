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
    // Silent health check - no logging to keep console clean

    return true;
  } catch (error) {
    console.log("✗ Health check failed:", error);
    return false;
  }
}