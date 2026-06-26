async function initializeDatabase() {
  console.log("Database initialization skipped - using memory storage");
  return false;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export { initializeDatabase };
