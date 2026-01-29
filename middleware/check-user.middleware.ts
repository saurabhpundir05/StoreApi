//#region imports
import { Request, Response, NextFunction } from "express";
//#endregion

//#region middleware

//This function only allows the user to work on own account only
function checkUser(req: any, res: Response, next: NextFunction) {
  const authUser = req.user;
  const { id } = req.body;
  if (!authUser || !id) {
    return res.status(400).json({ message: "Invalid user data" });
  }
  if (String(authUser.id) !== String(id)) {
    return res
      .status(403)
      .json({ message: "Can't access other user services" });
  }
  return next();
}
export default checkUser;
//#endregion
