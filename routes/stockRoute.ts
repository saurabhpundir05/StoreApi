import express, { Router, Request, Response } from "express";
import checkAuthUsingJwt from "../middleware/checkAuth";
import { UpdateCartDTO, StockResponseDTO } from "../dtos/stock.dto";
import { getAllStock, updateStockQuantity } from "../services/stockServices";
const router: Router = express.Router();

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
  }
);

//update stock
router.patch(
  "/updateStockQuantity",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const updateData = new UpdateCartDTO(req.body);
      updateData.validate();
      const result = await updateStockQuantity(
        updateData.p_id,
        updateData.quantity
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
  }
);

export default router;
