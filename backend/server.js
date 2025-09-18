import express from "express";
import dotenv from "dotenv";
import postRoutes from "./routes/post.route.js";
import authRouter from "./routes/auth.route.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import {v2 as cloudinary} from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // React app URL
  credentials: true,               // allow cookies to be sent
}));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  connectMongoDB();
});
