import express, { Router, Request, Response } from "express";
import checkAuthUsingJwt from "../middleware/checkAuth";
import { AddCartDTO, CartResponseDTO } from "../dtos/cart.dto";
import {
  addToCart,
  deleteAllRecords,
  getAllDetails,
} from "../services/cartServices";
const router: Router = express.Router();

//add to cart
router.post(
  "/addToCart",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const dto = new AddCartDTO(req.body);
      dto.validate();
      const result = await addToCart(dto.items);
      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: result,
      });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      return res.status(400).json({ success: false, message });
    }
  }
);

//delete cart details
router.delete(
  "/deleteAllRecords",
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
  }
);

//Get all cart details
router.get(
  "/getAllCartDetails",
  checkAuthUsingJwt,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const cartDTOs: CartResponseDTO[] = await getAllDetails();
      return res.status(200).json(cartDTOs);
    } catch (err: unknown) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
  }
);

export default router;
