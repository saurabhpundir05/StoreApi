//#region imports
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
//#endregion

//#region jwtToken

dotenv.config();

export function generateToken(id: number, name: string, role: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id, name, role }, secret, { expiresIn: "1h" });
}
//#endregion