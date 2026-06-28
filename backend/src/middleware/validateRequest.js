const { createHttpError } = require("../utils/httpError");
const { sanitizeObject } = require("../utils/sanitize");

const formatIssues = (issues) =>
  issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

const validateRequest = (schemas) => (req, res, next) => {
  try {
    req.validated = {};

    if (schemas.body) {
      req.body = schemas.body.parse(sanitizeObject(req.body));
      req.validated.body = req.body;
    }

    if (schemas.query) {
      req.validated.query = schemas.query.parse(sanitizeObject(req.query));
    }

    if (schemas.params) {
      req.validated.params = schemas.params.parse(sanitizeObject(req.params));
    }

    next();
  } catch (error) {
    next(createHttpError(400, "Validation failed.", formatIssues(error.issues || [])));
  }
};

module.exports = validateRequest;
