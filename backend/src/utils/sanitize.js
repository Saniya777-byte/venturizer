const sanitizeString = (value) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;

const sanitizeObject = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sanitizeObject(nestedValue),
      ])
    );
  }

  return sanitizeString(value);
};

module.exports = {
  sanitizeObject,
  sanitizeString,
};
