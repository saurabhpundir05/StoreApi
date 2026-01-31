//#region imports
import { Request, Response, NextFunction } from "express";
//#endregion

//#region middleware

//This function only allows the person to work on own account only
function checkUser(req: any, res: Response, next: NextFunction) {
  const authUser = req.user;
  const { id } = req.body;
  if (!authUser || !id) {
    return res.status(400).json({ message: "Invalid user data" });
  }
  if (Number(authUser.id) !== Number(id)) {
    return res
      .status(403)
      .json({ message: "Can't access other person services" });
  }
  return next();
}
export default checkUser;
//#endregion
