const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const leadRoutes = require("./routes/lead.routes");

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        success: false,
        message: "Too many requests."
    }
});

app.use("/api", apiLimiter);

app.get("/health", (req,res)=>{
    res.json({
        success:true,
        message:"Server is healthy"
    });
});

app.use("/api/leads", leadRoutes);

module.exports = app;