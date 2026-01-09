import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();
let latestToken: string | null = null;
export function registerToken(token: string) {
  latestToken = token;
}
async function checkAuthUsingJwt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token found" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      name: string;
    };
    if (latestToken && latestToken !== token) {
      return res
        .status(401)
        .json({ message: "Session expired due to new login" });
    }
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Unauthorized User / Invalid Token" });
  }
}

export default checkAuthUsingJwt;
