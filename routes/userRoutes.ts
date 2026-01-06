import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  findUserById,
  createNewUser,
  loginUser,
  deleteUserAccount,
  softDeleteUserAccount,
  updateUserDetails,
} from "../services/userServices";
import { SignupDTO, LoginDTO } from "../dtos/user.dto";
import { generateToken } from "../helpers/jwtToken";
import checkAuthUsingJwt from "../middleware/checkAuth";
import checkUser from "../middleware/checkTrueUser";
const router: Router = express.Router();

// Signup route
router.post(
  "/signup",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const signupData = new SignupDTO(req.body);
      signupData.validate();
      const userId = Number(signupData.id);
      const existingUser = await findUserById(userId);
      if (existingUser) {
        return res.status(409).json({ message: "User id already exists" });
      }
      const hashedPassword = await bcrypt.hash(signupData.password, 10);
      await createNewUser(userId, signupData.name, hashedPassword);
      return res.status(201).json({
        message: "User created successfully, now Log In",
      });
    } catch (err: unknown) {
      //err: unknown, the error could be any type, not just Error.
      console.error(err);
      //err instanceof Error Checks if err is a real JavaScript Error object.
      //If it is, use err.message (the error message string). If it’s not (e.g., someone
      // threw a string or something weird), fallback to "Something went wrong".
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      return res.status(400).json({ message });
    }
  }
);

//Login route
router.post(
  "/login",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const loginData = new LoginDTO(req.body);
      loginData.validate();
      const user = await loginUser(loginData.id);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isPasswordMatch = await bcrypt.compare(
        loginData.password,
        user.password
      );
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken(user.id as number, user.name);
      return res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

// delete user account
router.delete(
  "/deleteUserId",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const inputData = new LoginDTO(req.body);
      inputData.validate();
      const result = await deleteUserAccount(Number(inputData.id));
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "User not found / Is hard deleted" });
      }
      return res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

//soft delete user account
router.delete(
  "/softDeleteUser",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const inputData = new LoginDTO(req.body);
      inputData.validate();
      const result = await softDeleteUserAccount(Number(inputData.id));
      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "User soft deleted" });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

//update password and name
router.patch(
  "/updateUserPassword",
  checkAuthUsingJwt,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const inputData = new SignupDTO(req.body);
      inputData.validate();
      const hashedPassword = await bcrypt.hash(inputData.password, 10);
      const result = await updateUserDetails(
        Number(inputData.id),
        inputData.name,
        hashedPassword
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found or deleted" });
      }
      return res.status(200).json({
        message: "User password updated successfully",
      });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

export default router;
