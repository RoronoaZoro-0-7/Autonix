import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { tryCatch } from "../utils/TryCatch";
import { isTokenBlacklisted } from "../utils/helpers";

const isAuth = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // check blacklist first — if logged out, reject immediately
  const blacklisted = await isTokenBlacklisted(token);
  if (blacklisted) {
    return res.status(401).json({ message: "Token has been revoked" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
    req.user = {
      userId: decoded.userId,
      // remove role — we'll get it from DB when needed
      email: decoded.email
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default isAuth;