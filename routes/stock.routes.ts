//#region imports
import express, { Router, Request, Response } from "express";
import checkAuthUsingJwt from "../middleware/jwt-auth.middleware";
import { UpdateCartDTO, StockResponseDTO } from "../dtos/stock.dto";
import { getAllStock, updateStockQuantity } from "../services/stock.services";
import { authorizeRole } from "../middleware/authorize-role.middleware";
//#endregion

//#region Api's

const router: Router = express.Router();

//get all stocks
router.get(
  "/getallstocks",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const stockDTOs: StockResponseDTO[] = await getAllStock();
      return res.status(200).json(stockDTOs);
    } catch (err: unknown) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
  },
);

//update stock
router.patch(
  "/update",
  checkAuthUsingJwt,
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const updateData = new UpdateCartDTO(req.body);
      updateData.validate();
      const result = await updateStockQuantity(
        updateData.p_id,
        updateData.quantity,
      );
      if (!result) {
        return res.status(404).json({ message: "Stock not found" });
      }
      return res.status(200).json({ message: "Stock updated succesfully" });
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
 *   name: Stock
 *   description: Stock management endpoints
 */

/**
 * @swagger
 * /stock/update:
 *   patch:
 *     summary: Update stock quantity for a product
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - p_id
 *               - quantity
 *             properties:
 *               p_id:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       404:
 *         description: Stock not found
 *       400:
 *         description: Validation error or bad request
 */

/**
 * @swagger
 * /stock/getallstocks:
 *   get:
 *     summary: Get all stock details
 *     tags: [Stock]
 *     responses:
 *       200:
 *         description: List of all stocks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   p_id:
 *                     type: integer
 *                     example: 1
 *                   p_name:
 *                     type: string
 *                     example: "Samsung Galaxy S26"
 *                   quantity:
 *                     type: integer
 *                     example: 100
 *       500:
 *         description: Database error
 */

//#endregion
