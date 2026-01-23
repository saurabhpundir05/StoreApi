//#region imports
import express, { Router, Request, Response } from "express";
import checkAuthUsingJwt from "../middleware/checkAuth";
import { UpdateCartDTO, StockResponseDTO } from "../dtos/stock.dto";
import { getAllStock, updateStockQuantity } from "../services/stockServices";
import { authorizeRole } from "../middleware/authorizeRole";
//#endregion

//#region Api's

const router: Router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateStock:
 *       type: object
 *       required:
 *         - p_id
 *         - quantity
 *       properties:
 *         p_id:
 *           type: number
 *           example: 1
 *         quantity:
 *           type: number
 *           example: 50
 *
 *     StockResponse:
 *       type: object
 *       properties:
 *         p_id:
 *           type: number
 *           example: 1
 *         p_name:
 *           type: string
 *           example: "Laptop"
 *         quantity:
 *           type: number
 *           example: 50
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: 2026-01-20T12:00:00Z
 */

/**
 * @swagger
 * /getAllStocks:
 *   get:
 *     summary: Retrieve all stock details
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stock items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 */

//get all stocks
router.get(
  "/getAllStocks",
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

/**
 * @swagger
 * /updateStockQuantity:
 *   patch:
 *     summary: Update the quantity of a stock item
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStock'
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stock updated successfully
 *       400:
 *         description: Validation or bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Stock not found
 */

//update stock
router.patch(
  "/updateStockQuantity",
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
