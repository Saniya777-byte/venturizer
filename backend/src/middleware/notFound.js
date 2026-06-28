const { createHttpError } = require("../utils/httpError");

const notFound = (req, res, next) => {
  next(createHttpError(404, "Route not found."));
};

module.exports = notFound;
