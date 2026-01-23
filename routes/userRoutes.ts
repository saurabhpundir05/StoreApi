//#region imports
import express, { Router, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import {
  createNewUser,
  getUserDetail,
  updateUser,
  deleteUser,
  softDeleteUser,
  getUserDetailByGoogleId,
  createNewUserOAuth,
  checkUserEmail,
  getUserDetailById,
} from "../services/userServices";
import { verifyGoogleToken } from "../services/googleOAuthServices";
import { getAllUserDetails } from "../services/userServices";
import { SignupDTO, LoginDTO, UpdateDTO, DeleteDTO } from "../dtos/user.dto";
import { CartResponseDTO } from "../dtos/cart.dto";
import { generateToken } from "../helpers/jwtToken";
import checkAuthUsingJwt from "../middleware/checkAuth";
import checkUser from "../middleware/checkTrueUser";
import { authorizeRole } from "../middleware/authorizeRole";
const router: Router = express.Router();
import dotenv from "dotenv";
dotenv.config();
const PORT = Number(process.env.PORT) || 3001;
const HOST = String(process.env.HOST);
//#endregion

//#region Api's
/**
 * @swagger
 * components:
 *   schemas:
 *     Signup:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Gojo
 *         email:
 *           type: string
 *           example: gojo@saturo.com
 *         password:
 *           type: string
 *           example: password123
 *
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: abc@xyz.com
 *         password:
 *           type: string
 *           example: password123
 *
 *     GoogleAuthTokenGenerate:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           example: http://localhost:3000/auth/google
 *
 *     GoogleAuth:
 *       type: object
 *       required:
 *         - idToken
 *       properties:
 *         idToken:
 *           type: string
 *           example: eyJhbGciOiJSUzI1NiIsImtpZCI6...
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Signup'
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
 *       400:
 *         description: Validation error
 */

// Signup route
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const signupData = new SignupDTO(req.body);
    signupData.validate();
    const hashedPassword = await bcrypt.hash(signupData.password, 10);
    const result = await createNewUser(
      signupData.name,
      signupData.email,
      hashedPassword,
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

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Generate Google OAuth URL
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google OAuth URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoogleAuthTokenGenerate'
 *       500:
 *         description: Google OAuth failed
 */

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
        //Requests a refresh token, which allows you to get new access tokens without the user signing in again
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

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login or signup using Google OAuth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleAuth'
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *       400:
 *         description: Missing idToken or id
 *       500:
 *         description: Google login failed
 */

//Signup /LogIn using Google OAuth
router.post("/auth/googleAuth", async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: "idToken is required" });
  }
  try {
    const { sub: googleID, email, name } = await verifyGoogleToken(idToken);
    let user = await getUserDetailByGoogleId(String(googleID));
    if (!user) {
      user = await createNewUserOAuth(name, email, googleID);
    }
    const role = "user";
    const token = generateToken(user.id, user.name, role);
    return res.status(200).json({ token });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Google login failed", error: err.message });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials or soft deleted user
 *       400:
 *         description: Validation error
 */

//Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const loginData = new LoginDTO(req.body);
    loginData.validate();
    const getUserPassword = await getUserDetail(loginData.email);
    if (getUserPassword.isDeleted == true) {
      return res.status(401).json({ message: "User soft deleted" });
    }
    if (!getUserPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordMatch = await bcrypt.compare(
      loginData.password,
      getUserPassword.password,
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const role = "user";
    const token = generateToken(
      getUserPassword.id as number,
      getUserPassword.name,
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
 * /getUserCartHistory/{id}:
 *   get:
 *     summary: Get shopping cart history of a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Cart history retrieved successfully
 *       400:
 *         description: Error fetching cart history
 *       401:
 *         description: Unauthorized
 */

// get shopping history
router.get(
  "/getUserCartHistory/:id",
  authorizeRole("user"),
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const cartDTOs: CartResponseDTO[] = await getAllUserDetails(
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

/**
 * @swagger
 * /updateUserDetails:
 *   patch:
 *     summary: Update user name and password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Signup'
 *     responses:
 *       201:
 *         description: User updated successfully
 *       409:
 *         description: User not found
 *       400:
 *         description: Validation error
 */

//update password and name
router.patch(
  "/updateUserDetails",
  checkAuthUsingJwt,
  checkUser,
  authorizeRole("user"),
  async (req: Request, res: Response) => {
    try {
      const inputData = new UpdateDTO(req.body);
      inputData.validate();
      const checkEmail = await checkUserEmail(inputData.email);
      if (checkEmail) {
        return res.status(200).json({ message: "Email Already Exists." });
      }
      const hashedPassword = await bcrypt.hash(inputData.password, 10);
      const result = await updateUser(
        Number(inputData.id),
        inputData.name,
        inputData.email,
        hashedPassword,
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
  },
);

/**
 * @swagger
 * /softDeleteUser:
 *   delete:
 *     summary: Soft delete user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: User soft deleted successfully
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found or already deleted
 */

// //soft delete user account
router.delete(
  "/softDeleteUser",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response) => {
    try {
      const inputData = new DeleteDTO(req.body);
      inputData.validate();
      const getUserPassword = await getUserDetailById(Number(inputData.id));
      if (!getUserPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isPasswordMatch = await bcrypt.compare(
        inputData.password,
        getUserPassword.password,
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
  },
);

/**
 * @swagger
 * /deleteUserId:
 *   delete:
 *     summary: Permanently delete user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */

// delete user account
router.delete(
  "/deleteUserId",
  checkAuthUsingJwt,
  checkUser,
  authorizeRole("admin"),
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const inputData = new DeleteDTO(req.body);
      inputData.validate();
      const getUserPassword = await getUserDetailById(Number(inputData.id));
      if (!getUserPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isPasswordMatch = await bcrypt.compare(
        inputData.password,
        getUserPassword.password,
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
  },
);
export default router;
//#endregion