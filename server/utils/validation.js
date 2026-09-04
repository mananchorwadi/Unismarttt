export function formatZodError(error) {
  return error.errors
    .map((err) => {
      const field = err.path.join(".");
      return `${field ? `${field}: ` : ""}${err.message}`;
    })
    .join(", ");
}
