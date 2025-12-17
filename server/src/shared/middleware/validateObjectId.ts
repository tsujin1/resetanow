import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "../utils/validation";

/**
 * Middleware to validate MongoDB ObjectId in route parameters
 */
export const validateObjectId = (paramName: string = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];

    if (!id) {
      res.status(400).json({ message: `${paramName} is required` });
      return;
    }

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: `Invalid ${paramName} format` });
      return;
    }

    next();
  };
};





