//#region imports
import express, { Router, Request, Response } from "express";
import {
  insertDiscountValue,
  getAllDiscountValues,
  updateDiscountValues,
} from "../services/discount-values.services";
import { AddDTO, DiscountResponseDTO } from "../dtos/discount-values.dto";
import checkAuthUsingJwt from "../middleware/jwt-auth.middleware";
import { authorizeRole } from "../middleware/authorize-role.middleware";
//#endregion

//#region Api's

const router: Router = express.Router();

//add discount value against types
router.post(
  "/adddiscountvalue",
  checkAuthUsingJwt,
  authorizeRole("admin"),
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
        message: "Discount value added successfully",
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

//Get all discountValues
router.get(
  "/getalldiscountvalues",
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

//modify discountvalue
router.patch(
  "/update",
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

//#region Swagger

/**
 * @swagger
 * tags:
 *   name: DiscountValues
 *   description: Discount value management endpoints
 */

/**
 * @swagger
 * /discountvalues/adddiscountvalue:
 *   post:
 *     summary: Add a discount value
 *     tags: [DiscountValues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - d_id
 *             properties:
 *               d_id:
 *                 type: integer
 *                 example: 1
 *               d_flat:
 *                 type: number
 *                 example: 288
 *               d_percent:
 *                 type: number
 *                 example: 28
 *     responses:
 *       201:
 *         description: Discount value added successfully
 *       400:
 *         description: Validation error or bad request
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * /discountvalues/update:
 *   patch:
 *     summary: Update discount value
 *     tags: [DiscountValues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - d_id
 *             properties:
 *               d_id:
 *                 type: integer
 *                 example: 2
 *               d_flat:
 *                 type: number
 *                 example: 288
 *               d_percent:
 *                 type: number
 *                 example: 28
 *     responses:
 *       200:
 *         description: Discount value updated successfully
 *       400:
 *         description: Validation error or bad request
 */

/**
 * @swagger
 * /discountvalues/getalldiscountvalues:
 *   get:
 *     summary: Get all discount values
 *     tags: [DiscountValues]
 *     responses:
 *       200:
 *         description: Returns list of all discount values
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   d_id:
 *                     type: integer
 *                     example: 1
 *                   d_flat:
 *                     type: number
 *                     example: 288
 *                   d_percent:
 *                     type: number
 *                     example: 28
 *       500:
 *         description: Database error
 */

//#endregion
