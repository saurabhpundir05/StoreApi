import express, { Router, Request, Response } from "express";
import {
  insertDiscounts,
  deleteDiscounts,
  modifyDiscount,
} from "../services/discountServices";
import { AddDTO, DeleteDTO, UpdateDiscountDTO } from "../dtos/discount.dto";
import checkAuthUsingJwt from "../middleware/checkAuth";
const router: Router = express.Router();

//add discount on a product
router.post(
  "/addDiscount",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const discountData = new AddDTO(req.body);
      discountData.validate();
      await insertDiscounts(discountData.id, discountData.type);
      return res.status(200).json({ message: "Discount added successfully" });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

//delete discount from a product
router.delete(
  "/deleteDiscounts",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const discountData = new DeleteDTO(req.body);
      discountData.validate();
      await deleteDiscounts(discountData.id);
      return res.status(200).json({ message: "Discount deleted successfully" });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

//modify discount on products
router.patch(
  "/modifyDiscounts",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const discountData = new UpdateDiscountDTO(req.body);
      discountData.validate();
      const result = await modifyDiscount(discountData.id, discountData.type);
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
  }
);

export default router;
