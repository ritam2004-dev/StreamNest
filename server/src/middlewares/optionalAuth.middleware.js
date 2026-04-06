import jwt from "jsonwebtoken";
import User from "../models/user.models.js"; // ✅ FIXED (no {})

export const optionalAuth = async (req, res, next) => {
  console.log("=== OPTIONAL AUTH DEBUG ===");
  console.log("Authorization header:", req.headers.authorization);
  console.log("All headers:", req.headers);
  console.log("==========================");

  try {
    const authHeader = req.headers.authorization;

    // 👉 agar token nahi hai → guest user
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // 👉 DB se user fetch
    const user = await User.findById(decoded._id).select("-password");

    req.user = user || null;

    next();
  } catch (err) {
    console.error("JWT VERIFY ERROR:", err.message);

    // 👉 error hone par bhi request continue karega (optional auth hai)
    req.user = null;
    next();
  }
};