//#region imports
import express, { Router, Request, Response } from "express";
import {
  insertDiscount,
  getAllDiscounts,
  modifyDiscount,
  deleteDiscount,
} from "../services/discount.services";
import {
  AddDTO,
  DeleteDTO,
  UpdateDiscountDTO,
  DiscountResponseDTO,
} from "../dtos/discount.dto";
import { authorizeRole } from "../middleware/authorize-role.middleware";
import checkAuthUsingJwt from "../middleware/jwt-auth.middleware";
//#endregion

//#region Api's

const router: Router = express.Router();

//add discount on a product
router.post(
  "/add",
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

//Get all discounts
router.get(
  "/getalldiscounts",
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

//modify discount on products
router.patch(
  "/update",
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

//delete discount from a product
router.delete(
  "/delete",
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

//#region Swagger

/**
 * @swagger
 * tags:
 *   name: Discount
 *   description: Discount management endpoints
 */

/**
 * @swagger
 * /discount/add:
 *   post:
 *     summary: Add a discount to a product
 *     tags: [Discount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - p_id
 *               - d_type
 *             properties:
 *               p_id:
 *                 type: integer
 *                 example: 1
 *               d_type:
 *                 type: string
 *                 enum: [FLAT, PERCENT]
 *                 example: FLAT
 *     responses:
 *       200:
 *         description: Discount added successfully
 *       400:
 *         description: Validation error or bad request
 */

/**
 * @swagger
 * /discount/update:
 *   patch:
 *     summary: Update a discount on a product
 *     tags: [Discount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - d_id
 *               - d_type
 *             properties:
 *               d_id:
 *                 type: integer
 *                 example: 2
 *               d_type:
 *                 type: string
 *                 enum: [FLAT, PERCENT]
 *                 example: FLAT
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *       404:
 *         description: Discount not found
 *       400:
 *         description: Validation error or bad request
 */

/**
 * @swagger
 * /discount/delete:
 *   delete:
 *     summary: Delete a discount from a product
 *     tags: [Discount]
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
 *     responses:
 *       200:
 *         description: Discount deleted successfully
 *       404:
 *         description: Discount not found
 *       400:
 *         description: Validation error or bad request
 */

/**
 * @swagger
 * /discount/getalldiscounts:
 *   get:
 *     summary: Get all discounts
 *     tags: [Discount]
 *     responses:
 *       200:
 *         description: Returns list of all discounts
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
 *                   p_id:
 *                     type: integer
 *                     example: 1
 *                   d_type:
 *                     type: string
 *                     enum: [FLAT, PERCENT]
 *                     example: FLAT
 *       500:
 *         description: Database error
 */

//#endregion
