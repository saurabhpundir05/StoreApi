import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function generateToken(id: number, name: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id, name }, secret, { expiresIn: "1h" });
}
