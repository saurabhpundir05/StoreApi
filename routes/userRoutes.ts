import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  createNewUser,
  getUserDetail,
  updateUser,
  deleteUser,
  softDeleteUser,
} from "../services/userServices";
import { getAllUserDetails } from "../services/userServices";
import { SignupDTO, LoginDTO } from "../dtos/user.dto";
import { CartResponseDTO } from "../dtos/cart.dto";
import { generateToken } from "../helpers/jwtToken";
import checkAuthUsingJwt from "../middleware/checkAuth";
import checkUser from "../middleware/checkTrueUser";
const router: Router = express.Router();

// Signup route
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const signupData = new SignupDTO(req.body);
    signupData.validate();
    const hashedPassword = await bcrypt.hash(signupData.password, 10);
    const result = await createNewUser(
      Number(signupData.id),
      signupData.name,
      hashedPassword
    );
    if (result != null) {
      return res.status(201).json({
        message: "User created successfully, now Log In",
      });
    }
    return res.status(409).json({
      message: "User with this id already exist",
    });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Something went wrong";
    return res.status(400).json({ message });
  }
});

//Login route
router.post("/login", async (req: Request, res: Response) => {
  try {
    const loginData = new LoginDTO(req.body);
    loginData.validate();
    const getUserPassword = await getUserDetail(Number(loginData.id));
    if (getUserPassword.isDeleted == true) {
      return res.status(401).json({ message: "User soft deleted" });
    }
    if (!getUserPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordMatch = await bcrypt.compare(
      loginData.password,
      getUserPassword.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(
      getUserPassword.id as number,
      getUserPassword.name
    );
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
});

//get shopping history
router.get(
  "/getUserCartHistory/:id",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const cartDTOs: CartResponseDTO[] = await getAllUserDetails(
        Number(req.params.id)
      );
      return res.status(200).json(cartDTOs);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      return res.status(400).json({ message });
    }
  }
);

//update password and name
router.patch(
  "/updateUserDetails",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response) => {
    try {
      const inputData = new SignupDTO(req.body);
      inputData.validate();
      const hashedPassword = await bcrypt.hash(inputData.password, 10);
      const result = await updateUser(
        Number(inputData.id),
        inputData.name,
        hashedPassword
      );
      if (!result) {
        return res.status(409).json({ message: "User not found to update" });
      }
      return res
        .status(201)
        .json({ message: `User with ${result} id is updated` });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

// //soft delete user account
router.delete(
  "/softDeleteUser",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response) => {
    try {
      const inputData = new LoginDTO(req.body);
      inputData.validate();
      const getUserPassword = await getUserDetail(Number(inputData.id));
      if (!getUserPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isPasswordMatch = await bcrypt.compare(
        inputData.password,
        getUserPassword.password
      );
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const result = await softDeleteUser(Number(inputData.id));
      if (!result) {
        return res.status(404).json({
          message: "User not found / Is hard deleted / Is SoftDeleted",
        });
      }
      return res.status(200).json({
        message: "User soft deleted successfully",
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
      const getUserPassword = await getUserDetail(Number(inputData.id));
      if (!getUserPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isPasswordMatch = await bcrypt.compare(
        inputData.password,
        getUserPassword.password
      );
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const result = await deleteUser(Number(inputData.id));
      if (!result) {
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

export default router;
