//#region imports
import express, { Router, Request, Response } from "express";
import {
  insertDiscountValue,
  getAllDiscountValues,
  updateDiscountValues,
} from "../services/discountTypeServices";
import { AddDTO, DiscountResponseDTO } from "../dtos/discountType.dto";
import checkAuthUsingJwt from "../middleware/checkAuth";
import { authorizeRole } from "../middleware/authorizeRole";
//#endregion

//#region Api's

const router: Router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AddDiscountType:
 *       type: object
 *       required:
 *         - d_id
 *         - d_flat
 *         - d_percent
 *       properties:
 *         d_id:
 *           type: number
 *           example: 1
 *         d_flat:
 *           type: number
 *           example: 50
 *         d_percent:
 *           type: number
 *           example: 10
 *
 *     DiscountTypeResponse:
 *       type: object
 *       properties:
 *         d_id:
 *           type: number
 *           example: 1
 *         d_flat:
 *           type: number
 *           example: 50
 *         d_percent:
 *           type: number
 *           example: 10
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2026-01-20T12:00:00Z
 */

/**
 * @swagger
 * /addDiscountType:
 *   post:
 *     summary: Add a new discount type
 *     tags: [DiscountType]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddDiscountType'
 *     responses:
 *       201:
 *         description: Discount type added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Discount type added successfully
 *                 discountValueId:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: Validation or server error
 *       401:
 *         description: Unauthorized
 */

//add discount types
router.post(
  "/addDiscountType",
  authorizeRole("admin"),
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const dto = new AddDTO(req.body);
      dto.validate();
      const result = await insertDiscountValue(
        dto.d_id,
        dto.d_flat,
        dto.d_percent,
      );
      return res.status(201).json({
        message: "Discount type added successfully",
        discountValueId: result,
      });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
);

/**
 * @swagger
 * /getAllDiscountValues:
 *   get:
 *     summary: Get all discount values
 *     tags: [DiscountType]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of discount values
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiscountTypeResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 */

//Get all discountValues
router.get(
  "/getAllDiscountValues",
  checkAuthUsingJwt,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const discountDTOs: DiscountResponseDTO[] = await getAllDiscountValues();
      return res.status(200).json(discountDTOs);
    } catch (err: unknown) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
  },
);

/**
 * @swagger
 * /modifyDiscountValues:
 *   patch:
 *     summary: Update an existing discount value
 *     tags: [DiscountType]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddDiscountType'
 *     responses:
 *       201:
 *         description: Discount value updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Discount value updated successfully
 *                 discountType:
 *                   $ref: '#/components/schemas/DiscountTypeResponse'
 *       400:
 *         description: Validation error or bad request
 *       401:
 *         description: Unauthorized
 */

//modify discountvalue
router.patch(
  "/modifyDiscountValues",
  authorizeRole("admin"),
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const updateData = new AddDTO(req.body);
      const result = await updateDiscountValues(
        updateData.d_id,
        updateData.d_flat,
        updateData.d_percent,
      );
      return res.status(201).json({
        message: "Discount value updated successfully",
        discountType: result,
      });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Something went wrong" });
    }
  },
);

export default router;
//#endregion
