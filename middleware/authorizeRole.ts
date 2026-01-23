import { Request, Response, NextFunction } from "express";

//to check role
export const authorizeRole = (role: "admin" | "user") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== role) {
      return res.status(403).json({
        message: `Forbidden: You need ${role} privileges to access this.`,
      });
    }
    next();
  };
};