//#region imports
import express, { Router, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import {
  insertAdmin,
  getAdminDetail,
  updateAdmin,
  softDeleteAdmin,
  deleteAdmin,
  getAdminDetailById,
  getAdminDetailByGoogleId,
  createNewAdminOAuth,
  getAllAdminDetails,
} from "../services/admin.services";
import { verifyGoogleToken } from "../services/google-oauth.services";
import { SignupDTO, LoginDTO, UpdateDTO, DeleteDTO } from "../dtos/admin.dto";
import { CartResponseDTO } from "../dtos/cart.dto";
import { generateToken } from "../helpers/jwt-token.helper";
import checkAuthUsingJwt from "../middleware/jwt-auth.middleware";
import checkUser from "../middleware/check-user.middleware";
import { authorizeRole } from "../middleware/authorize-role.middleware";
import dotenv from "dotenv";
dotenv.config();
const router: Router = express.Router();
const PORT = Number(process.env.PORT) || 3001;
const HOST = String(process.env.HOST);
//#endregion

//#region Api's

// Signup route
router.post("/signup", async (req: Request, res: Response) => {
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

//get IdToken from GoogleOAuth
router.get("/auth/google", async (req, res) => {
  //creates a new Google OAuth2 client from the google-auth-library.
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `http://${HOST}:${PORT}/auth/google`,
  );
  try {
    const code = req.query.code as string;
    if (!code) {
      const url = client.generateAuthUrl({
        //Requests a refresh token, which allows you to get new access tokens without the admin signing in again
        access_type: "offline",
        scope: ["openid", "email", "profile"],
      });
      //Redirects the user to Google’s OAuth consent screen.
      return res.redirect(url);
    }
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;
    if (!idToken)
      return res.status(400).json({ message: "No idToken received" });
    res.json({ idToken });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Google OAuth failed", error: err.message });
  }
});

//Signup /LogIn using Google OAuth
router.post("/auth/googleAuth", async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: "idToken is required" });
  }
  try {
    const { sub: googleID, email, name } = await verifyGoogleToken(idToken);
    let admin = await getAdminDetailByGoogleId(String(googleID));
    if (!admin) {
      admin = await createNewAdminOAuth(name, email, googleID);
    }
    const role = "admin";
    const token = generateToken(admin.id, admin.name, role);
    return res.status(200).json({ token });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Google login failed", error: err.message });
  }
});

// Login route
router.post("/login", async (req: Request, res: Response) => {
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

// get shopping history
router.get(
  "/getcarthistory/:id",
  checkAuthUsingJwt,
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const cartDTOs: CartResponseDTO[] = await getAllAdminDetails(
        Number(req.params.id),
      );
      return res.status(200).json(cartDTOs);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      return res.status(400).json({ message });
    }
  },
);

// update password and and email
router.patch(
  "/update",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response) => {
    try {
      const inputData = new UpdateDTO(req.body);
      inputData.validate();
      const hashedPassword = await bcrypt.hash(inputData.password, 10);
      const result = await updateAdmin(
        inputData.adminId,
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

// soft delete admin account
router.delete(
  "/softdelete",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response) => {
    try {
      const inputData = new DeleteDTO(req.body);
      inputData.validate();
      const getAdminPassword = await getAdminDetailById(inputData.adminId);
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
      const result = await softDeleteAdmin(inputData.adminId);
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

// delete admin account
router.delete(
  "/delete",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const inputData = new DeleteDTO(req.body);
      inputData.validate();
      const getAdminPassword = await getAdminDetailById(inputData.adminId);
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
      const result = await deleteAdmin(inputData.adminId);
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

//#region Swagger

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin authentication and management endpoints
 */

/**
 * @swagger
 * /admin/signup:
 *   post:
 *     summary: Admin registration
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gotens"
 *               email:
 *                 type: string
 *                 example: "gotens@dbz.com"
 *               password:
 *                 type: string
 *                 example: "asdfghjk"
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       409:
 *         description: Admin with this email already exists
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "vegeto@dbz.com"
 *               password:
 *                 type: string
 *                 example: "asdfghjk"
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /admin/update:
 *   patch:
 *     summary: Update admin details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "vegeto@dbz.com"
 *               name:
 *                 type: string
 *                 example: "Vegeto"
 *               password:
 *                 type: string
 *                 example: "abcdefghijk"
 *     responses:
 *       201:
 *         description: Admin updated successfully
 *       400:
 *         description: Validation or other error
 *       409:
 *         description: Admin not found to update
 */

/**
 * @swagger
 * /admin/softdelete:
 *   patch:
 *     summary: Soft delete admin account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: abcdefhj..
 *     responses:
 *       200:
 *         description: Admin soft deleted successfully
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Admin not found / already deleted
 */

/**
 * @swagger
 * /admin/delete:
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
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: abcdefghij..
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Admin not found / already deleted
 */

//#endregion
