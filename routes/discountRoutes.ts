//#region imports
import express, { Router, Request, Response } from "express";
import {
  insertDiscount,
  getAllDiscounts,
  modifyDiscount,
  deleteDiscount,
} from "../services/discountServices";
import {
  AddDTO,
  DeleteDTO,
  UpdateDiscountDTO,
  DiscountResponseDTO,
} from "../dtos/discount.dto";
import { authorizeRole } from "../middleware/authorizeRole";
import checkAuthUsingJwt from "../middleware/checkAuth";
//#endregion

//#region Api's

const router: Router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AddDiscount:
 *       type: object
 *       required:
 *         - p_id
 *         - d_type
 *       properties:
 *         p_id:
 *           type: number
 *           example: 101
 *         d_type:
 *           type: string
 *           example: "10% OFF"
 *
 *     UpdateDiscount:
 *       type: object
 *       required:
 *         - d_id
 *         - d_type
 *       properties:
 *         d_id:
 *           type: number
 *           example: 1
 *         d_type:
 *           type: string
 *           example: "15% OFF"
 *
 *     DeleteDiscount:
 *       type: object
 *       required:
 *         - d_id
 *       properties:
 *         d_id:
 *           type: number
 *           example: 1
 *
 *     DiscountResponse:
 *       type: object
 *       properties:
 *         d_id:
 *           type: number
 *           example: 1
 *         p_id:
 *           type: number
 *           example: 101
 *         d_type:
 *           type: string
 *           example: "10% OFF"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2026-01-20T12:00:00Z
 */

/**
 * @swagger
 * /addDiscount:
 *   post:
 *     summary: Add a discount to a product
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddDiscount'
 *     responses:
 *       200:
 *         description: Discount added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Discount Added Successfully
 *                 d_id:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: Validation or server error
 *       401:
 *         description: Unauthorized
 */

//add discount on a product
router.post(
  "/addDiscount",
  checkAuthUsingJwt,
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const discountData = new AddDTO(req.body);
      discountData.validate();
      const result = await insertDiscount(
        discountData.p_id,
        discountData.d_type,
      );
      return res
        .status(200)
        .json({ message: "Discount Added Successfully", d_id: result });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  },
);

/**
 * @swagger
 * /getAllDiscount:
 *   get:
 *     summary: Retrieve all discounts
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of discounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiscountResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 */

//Get all discounts
router.get(
  "/getAllDiscount",
  checkAuthUsingJwt,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const discountDTOs: DiscountResponseDTO[] = await getAllDiscounts();
      return res.status(200).json(discountDTOs);
    } catch (err: unknown) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
  },
);

/**
 * @swagger
 * /modifyDiscount:
 *   patch:
 *     summary: Modify an existing discount
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDiscount'
 *     responses:
 *       200:
 *         description: Discount modified successfully
 *       404:
 *         description: Discount not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

//modify discount on products
router.patch(
  "/modifyDiscount",
  checkAuthUsingJwt,
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const discountData = new UpdateDiscountDTO(req.body);
      discountData.validate();
      const result = await modifyDiscount(
        discountData.d_id,
        discountData.d_type,
      );
      if (!result) {
        return res.status(404).json({ message: "Discount not found" });
      }
      return res
        .status(200)
        .json({ message: "Discount modified successfully" });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  },
);

/**
 * @swagger
 * /deleteDiscount:
 *   delete:
 *     summary: Delete a discount from a product
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteDiscount'
 *     responses:
 *       200:
 *         description: Discount deleted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

//delete discount from a product
router.delete(
  "/deleteDiscount",
  checkAuthUsingJwt,
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const discountData = new DeleteDTO(req.body);
      discountData.validate();
      await deleteDiscount(discountData.d_id);
      return res.status(200).json({ message: "Discount deleted successfully" });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  },
);

export default router;
//#endregion
