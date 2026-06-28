const { Prisma } = require("@prisma/client");
const { HttpError } = require("../utils/httpError");

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A lead with this unique field already exists.",
      });
    }
  }

  console.error("[unhandled]", error);

  return res.status(500).json({
    success: false,
    message: "Something went wrong.",
  });
};

module.exports = errorHandler;
