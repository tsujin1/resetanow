import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Doctor } from "../../features/auth/models/Doctor";

interface JwtPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined");
        res.status(500).json({ message: "Server configuration error" });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      const user = await Doctor.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      (req as any).user = user;
      next();
      return;
    } catch (error) {
      res.status(401).json({ message: "Not authorized, invalid token" });
      return;
    }
  }

  // No token provided
  res.status(401).json({ message: "Not authorized, no token" });
};