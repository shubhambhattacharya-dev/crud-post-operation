import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid Token" });
  }
};

export default protectRoute;
