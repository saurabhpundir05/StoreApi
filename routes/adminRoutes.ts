import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  insertAdmin,
  getAdminDetail,
  updateAdmin,
  softDeleteAdmin,
  deleteAdmin,
} from "../services/adminServices";
import { SignupDTO, LoginDTO } from "../dtos/admin.dto";
import { generateToken } from "../helpers/jwtToken";
import checkAuthUsingJwt from "../middleware/checkAuth";
import checkUser from "../middleware/checkTrueUser";
const router: Router = express.Router();

// Signup route
router.post("/signupAdmin", async (req: Request, res: Response) => {
  try {
    const signupData = new SignupDTO(req.body);
    signupData.validate();
    const hashedPassword = await bcrypt.hash(signupData.password, 10);
    const result = await insertAdmin(
      Number(signupData.id),
      signupData.name,
      hashedPassword
    );
    if (result != null) {
      return res.status(201).json({
        message: "Admin created successfully, now Log In",
      });
    }
    return res.status(409).json({
      message: "Admin with this id already exist",
    });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Something went wrong";
    return res.status(400).json({ message });
  }
});

// Login route
router.post("/loginAdmin", async (req: Request, res: Response) => {
  try {
    const loginData = new LoginDTO(req.body);
    loginData.validate();
    const getAdminPassword = await getAdminDetail(Number(loginData.id));
    if (getAdminPassword.isDeleted == true) {
      return res.status(401).json({ message: "Admin soft /hard deleted" });
    }
    if (!getAdminPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordMatch = await bcrypt.compare(
      loginData.password,
      getAdminPassword.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(
      getAdminPassword.id as number,
      getAdminPassword.name
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

// update password and name
router.patch(
  "/updateAdminDetails",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response) => {
    try {
      const inputData = new SignupDTO(req.body);
      inputData.validate();
      const hashedPassword = await bcrypt.hash(inputData.password, 10);
      const result = await updateAdmin(
        Number(inputData.id),
        inputData.name,
        hashedPassword
      );
      if (!result) {
        return res.status(409).json({ message: "Admin not found to update" });
      }
      return res
        .status(201)
        .json({ message: `Admin with ${result} id is updated` });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

// soft delete admin account
router.delete(
  "/softDeleteAdmin",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response) => {
    try {
      const inputData = new LoginDTO(req.body);
      inputData.validate();
      const getAdminPassword = await getAdminDetail(Number(inputData.id));
      if (!getAdminPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isPasswordMatch = await bcrypt.compare(
        inputData.password,
        getAdminPassword.password
      );
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const result = await softDeleteAdmin(Number(inputData.id));
      if (!result) {
        return res.status(404).json({
          message: "Admin not found / Is hard deleted / Is SoftDeleted",
        });
      }
      return res.status(200).json({
        message: "Admin soft deleted successfully",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

// delete admin account
router.delete(
  "/deleteAdminId",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const inputData = new LoginDTO(req.body);
      inputData.validate();
      const getAdminPassword = await getAdminDetail(Number(inputData.id));
      if (!getAdminPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isPasswordMatch = await bcrypt.compare(
        inputData.password,
        getAdminPassword.password
      );
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const result = await deleteAdmin(Number(inputData.id));
      if (!result) {
        return res
          .status(404)
          .json({ message: "Admin not found / Is hard deleted" });
      }
      return res.status(200).json({
        message: "Admin deleted successfully",
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
