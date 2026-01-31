//#region imports
import express, { Router, Request, Response } from "express";
import { authorizeRole } from "../middleware/authorize-role.middleware";
import checkAuthUsingJwt from "../middleware/jwt-auth.middleware";
import { AddCartDTO, CartResponseDTO } from "../dtos/cart.dto";
import {
  addToCart,
  deleteAllRecords,
  getAllDetails,
} from "../services/cart.services";
import checkUser from "../middleware/check-user.middleware";
//#endregion

//#region Api's

const router: Router = express.Router();

//add to cart
router.post(
  "/addtocart",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const dto = new AddCartDTO(req.body);
      dto.validate();
      const result = await addToCart(
        Number(dto.userId),
        Number(dto.adminId),
        dto.items,
      );
      return res.status(200).json({
        success: true,
        message: "Added to cart",
        data: result,
      });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      return res.status(400).json({ success: false, message });
    }
  },
);

//delete cart details
router.delete(
  "/deleteall",
  checkAuthUsingJwt,
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const result = await deleteAllRecords();
      return res.status(200).json({
        message: "Cart Data Deleted Successfully",
      });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      return res.status(400).json({ success: false, message });
    }
  },
);

//Get all cart details
router.get(
  "/getalldetails",
  authorizeRole("admin"),
  checkAuthUsingJwt,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const cartDTOs: CartResponseDTO[] = await getAllDetails();
      return res.status(200).json(cartDTOs);
    } catch (err: unknown) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
  },
);

export default router;
//#endregion

//#region Swagger

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management endpoints
 */

/**
 * @swagger
 * /cart/addtocart:
 *   post:
 *     summary: Add items to a user's cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - items
 *             properties:
 *               id:
 *                 type: string
 *                 example: abcdefghi...
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - p_name
 *                     - quantity
 *                   properties:
 *                     p_name:
 *                       type: string
 *                       example: "Wire"
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: Items added to cart successfully
 *       400:
 *         description: Invalid request or validation error
 */

/**
 * @swagger
 * /cart/deleteall:
 *   delete:
 *     summary: Delete all items in all carts
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: All cart records deleted successfully
 *       500:
 *         description: Server or database error
 */

/**
 * @swagger
 * /cart/getalldetails:
 *   get:
 *     summary: Get all cart details
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Returns list of all cart details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: abdefghijk..
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         p_name:
 *                           type: string
 *                           example: "Wire"
 *                         quantity:
 *                           type: integer
 *                           example: 1
 *       500:
 *         description: Server or database error
 */

//#endregion
