//#region imports
import { Request, Response, NextFunction } from "express";
//#endregion

//#region middleware
function checkUser(req: any, res: Response, next: NextFunction) {
  const authUser = req.user;
  const { userId, adminId } = req.body;

  if (!authUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Pick whichever ID is provided
  const requestId = userId ?? adminId;

  if (!requestId) {
    return res.status(400).json({ message: "userId or adminId is required" });
  }

  if (Number(authUser.id) !== Number(requestId)) {
    return res
      .status(403)
      .json({ message: "Can't access other person's data" });
  }

  return next();
}

export default checkUser;
//#endregion
