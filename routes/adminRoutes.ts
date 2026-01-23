//#region imports
import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  insertAdmin,
  getAdminDetail,
  updateAdmin,
  softDeleteAdmin,
  deleteAdmin,
  getAdminDetailById,
} from "../services/adminServices";
import { SignupDTO, LoginDTO, UpdateDTO, DeleteDTO } from "../dtos/admin.dto";
import { generateToken } from "../helpers/jwtToken";
import checkAuthUsingJwt from "../middleware/checkAuth";
import checkUser from "../middleware/checkTrueUser";
const router: Router = express.Router();
//#endregion

//#region Api's

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminSignup:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - password
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Admin Name"
 *         password:
 *           type: string
 *           example: "securePassword123"
 *
 *     AdminLogin:
 *       type: object
 *       required:
 *         - id
 *         - password
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         password:
 *           type: string
 *           example: "securePassword123"
 *
 *     AdminResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Admin created successfully, now Log In"
 *
 *     AdminTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login successful"
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR..."
 */

/**
 * @swagger
 * /signupAdmin:
 *   post:
 *     summary: Create a new admin account
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminSignup'
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminResponse'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Admin with this id already exists
 */

// Signup route
router.post("/signupAdmin", async (req: Request, res: Response) => {
  try {
    const signupData = new SignupDTO(req.body);
    signupData.validate();
    const hashedPassword = await bcrypt.hash(signupData.password, 10);
    const result = await insertAdmin(
      signupData.email,
      signupData.name,
      hashedPassword,
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

/**
 * @swagger
 * /loginAdmin:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminTokenResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials or admin soft/hard deleted
 */

// Login route
router.post("/loginAdmin", async (req: Request, res: Response) => {
  try {
    const loginData = new LoginDTO(req.body);
    loginData.validate();
    const getAdminPassword = await getAdminDetail(loginData.email);
    if (getAdminPassword.isDeleted == true) {
      return res.status(401).json({ message: "Admin soft /hard deleted" });
    }
    if (!getAdminPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordMatch = await bcrypt.compare(
      loginData.password,
      getAdminPassword.password,
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const role = "admin";
    const token = generateToken(
      getAdminPassword.id as number,
      getAdminPassword.name,
      role,
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

/**
 * @swagger
 * /updateAdminDetails:
 *   patch:
 *     summary: Update admin name and password
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminSignup'
 *     responses:
 *       201:
 *         description: Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin with 1 id is updated"
 *       400:
 *         description: Validation error
 *       409:
 *         description: Admin not found to update
 *       401:
 *         description: Unauthorized
 */

// update password and name
router.patch(
  "/updateAdminDetails",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response) => {
    try {
      const inputData = new UpdateDTO(req.body);
      inputData.validate();
      const hashedPassword = await bcrypt.hash(inputData.password, 10);
      const result = await updateAdmin(
        inputData.id,
        inputData.email,
        inputData.name,
        hashedPassword,
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
  },
);

/**
 * @swagger
 * /softDeleteAdmin:
 *   delete:
 *     summary: Soft delete admin account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLogin'
 *     responses:
 *       200:
 *         description: Admin soft deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin soft deleted successfully"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Admin not found / Is hard deleted / Is SoftDeleted
 */

// soft delete admin account
router.delete(
  "/softDeleteAdmin",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response) => {
    try {
      const inputData = new DeleteDTO(req.body);
      inputData.validate();
      const getAdminPassword = await getAdminDetailById(inputData.id);
      if (!getAdminPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isPasswordMatch = await bcrypt.compare(
        inputData.password,
        getAdminPassword.password,
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
  },
);

/**
 * @swagger
 * /deleteAdminId:
 *   delete:
 *     summary: Hard delete admin account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLogin'
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin deleted successfully"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Admin not found / Is hard deleted
 */

// delete admin account
router.delete(
  "/deleteAdminId",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const inputData = new DeleteDTO(req.body);
      inputData.validate();
      const getAdminPassword = await getAdminDetailById(Number(inputData.id));
      if (!getAdminPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isPasswordMatch = await bcrypt.compare(
        inputData.password,
        getAdminPassword.password,
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
  },
);

export default router;
//#endregion
