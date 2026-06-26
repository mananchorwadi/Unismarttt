import { storage } from "./storage.js";

export async function healthCheck() {
  try {
    const testUser = {
      username: "test-user",
      password: "hashed-password",
      role: "student",
      fullName: "Test User",
      email: "test@example.com",
      universityId: "S-99999",
    };

    const user = await storage.createUser(testUser);

    return true;
  } catch (error) {
    console.log("✗ Health check failed:", error);
    return false;
  }
}
