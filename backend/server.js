import express from "express";
import dotenv from "dotenv";
import postRoutes from "./routes/post.route.js";
import authRouter from "./routes/auth.route.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // React app URL
  credentials: true,               // allow cookies to be sent
}));

// middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
import path from "path";

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: "File too large" });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  connectMongoDB();
});
