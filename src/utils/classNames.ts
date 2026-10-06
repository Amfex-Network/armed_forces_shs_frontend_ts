const key = (name: unknown) =>
  typeof name === "string"
    ? name.trim().replace(/\s+/g, " ").toLowerCase()
    : "";

// Class names are compared ignoring case and stray spaces, matching the API.
export const sameClass = (a: unknown, b: unknown) => {
  const ka = key(a);
  return ka !== "" && ka === key(b);
};
