import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user id
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized, invalid token" });
  }
};
