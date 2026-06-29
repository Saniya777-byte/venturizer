const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const env = require("./config/env");

const leadRoutes = require("./routes/lead.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://venturizer.vercel.app",
  "https://venturizer-git-main-saniyas-projects-f7ecb62f.vercel.app",
  "https://venturizer-b5zgh03oa-saniyas-projects-f7ecb62f.vercel.app",
];

if (env.clientUrl && !allowedOrigins.includes(env.clientUrl)) {
  allowedOrigins.push(env.clientUrl);
}

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (
        origin.endsWith(".vercel.app") &&
        origin.includes("venturizer")
      ) {
        return callback(null, true);
      }

      // console.log("Blocked by CORS:", origin);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests.",
    },
  })
);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy.",
  });
});

app.use("/api/leads", leadRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;