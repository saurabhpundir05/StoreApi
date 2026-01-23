//#region imports
import express, { Router, Request, Response } from "express";
import { authorizeRole } from "../middleware/authorizeRole";
import checkAuthUsingJwt from "../middleware/checkAuth";
import { AddCartDTO, CartResponseDTO } from "../dtos/cart.dto";
import {
  addToCart,
  deleteAllRecords,
  getAllDetails,
} from "../services/cartServices";
//#endregion

//#region Api's

const router: Router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - product_id
 *         - quantity
 *       properties:
 *         product_id:
 *           type: number
 *           example: 10
 *         quantity:
 *           type: number
 *           example: 2
 *
 *     AddToCart:
 *       type: object
 *       required:
 *         - id
 *         - items
 *       properties:
 *         id:
 *           type: number
 *           example: 101
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *
 *     CartResponse:
 *       type: object
 *       properties:
 *         user_id:
 *           type: number
 *           example: 101
 *         product_id:
 *           type: number
 *           example: 10
 *         quantity:
 *           type: number
 *           example: 2
 *         added_at:
 *           type: string
 *           format: date-time
 *           example: 2025-01-01T12:00:00Z
 */

/**
 * @swagger
 * /addToCart:
 *   post:
 *     summary: Add items to user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCart'
 *     responses:
 *       200:
 *         description: Items added to cart successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

//add to cart
router.post(
  "/addToCart",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const dto = new AddCartDTO(req.body);
      dto.validate();
      const result = await addToCart(dto.id, dto.items);
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

/**
 * @swagger
 * /deleteAllRecords:
 *   delete:
 *     summary: Delete all cart records
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart data deleted successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Deletion failed
 */

//delete cart details
router.delete(
  "/deleteAllRecords",
  authorizeRole("admin"),
  checkAuthUsingJwt,
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

/**
 * @swagger
 * /getAllCartDetails:
 *   get:
 *     summary: Get all cart details
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cart records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 */

//Get all cart details
router.get(
  "/getAllCartDetails",
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
