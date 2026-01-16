import { Request, Response, NextFunction } from "express";

function checkUser(req: any, res: Response, next: NextFunction) {
  const authUser = req.user;
  const { id } = req.body;
  if (!authUser || !id) {
    return res.status(400).json({ message: "Invalid user data" });
  }
  if (String(authUser.id) !== String(id)) {
    return res.status(403).json({ message: "Can't delete other user data" });
  }
  return next();
}
export default checkUser;
