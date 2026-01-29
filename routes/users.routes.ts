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
} from "../services/users.services";
import { verifyGoogleToken } from "../services/google-oauth.services";
import { getAllUserDetails } from "../services/users.services";
import { SignupDTO, LoginDTO, UpdateDTO, DeleteDTO } from "../dtos/users.dto";
import { CartResponseDTO } from "../dtos/cart.dto";
import { generateToken } from "../helpers/jwt-token.helper";
import checkAuthUsingJwt from "../middleware/jwt-auth.middleware";
import checkUser from "../middleware/check-user.middleware";
import { authorizeRole } from "../middleware/authorize-role.middleware";
const router: Router = express.Router();
import dotenv from "dotenv";
dotenv.config();
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
    const token = generateToken(getUserPassword.id, getUserPassword.name, role);
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
  authorizeRole("user"),
  async (req: Request, res: Response) => {
    try {
      const cartDTOs: CartResponseDTO[] = await getAllUserDetails(
        String(req.params.id),
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

//update password and name
router.patch(
  "/update",
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
        inputData.id,
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

// //soft delete user account
router.delete(
  "/softdelete",
  checkAuthUsingJwt,
  checkUser,
  async (req: Request, res: Response) => {
    try {
      const inputData = new DeleteDTO(req.body);
      inputData.validate();
      const getUserPassword = await getUserDetailById(String(inputData.id));
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
      const result = await softDeleteUser(String(inputData.id));
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

// delete user account
router.delete(
  "/delete",
  checkAuthUsingJwt,
  checkUser,
  authorizeRole("admin"),
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const inputData = new DeleteDTO(req.body);
      inputData.validate();
      const getUserPassword = await getUserDetailById(String(inputData.id));
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
      const result = await deleteUser(String(inputData.id));
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

//#region Swagger

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and management endpoints
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: User signup
 *     tags: [Users]
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
 *                 example: "Goku"
 *               email:
 *                 type: string
 *                 example: "goku@dbz.com"
 *               password:
 *                 type: string
 *                 example: "asdfghjk"
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User with this email already exists
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
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
 *                 example: "goku@dbz.com"
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
 * /users/getcarthistory/{id}:
 *   get:
 *     summary: Get shopping/cart history for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cart history for the user
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /users/update:
 *   patch:
 *     summary: Update user details
 *     tags: [Users]
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
 *               - name
 *               - password
 *             properties:
 *               id:
 *                 type: string
 *                 example: abcdefghij...
 *               name:
 *                 type: string
 *                 example: "gogeta"
 *               password:
 *                 type: string
 *                 example: "abc"
 *     responses:
 *       201:
 *         description: User updated successfully
 *       400:
 *         description: Validation or bad request
 *       409:
 *         description: User not found to update
 */

/**
 * @swagger
 * /users/softdelete:
 *   delete:
 *     summary: Soft delete a user account
 *     tags: [Users]
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
 *               - password
 *             properties:
 *               id:
 *                 type: string
 *                 example: abcdefgijk
 *               password:
 *                 type: string
 *                 example: "asdfghjk"
 *     responses:
 *       200:
 *         description: User soft deleted successfully
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found / already deleted
 */

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Hard delete a user account
 *     tags: [Users]
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
 *               - password
 *             properties:
 *               id:
 *                 type: string
 *                 example: abcdefg...
 *               password:
 *                 type: string
 *                 example: "xyz"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found / already deleted
 */

//#endregion
