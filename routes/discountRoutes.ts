import express, { Router, Request, Response } from "express";
import {
  insertDiscount,
  deleteDiscount,
  modifyDiscount,
  getAllDiscounts,
} from "../services/discountServices";
import {
  AddDTO,
  DeleteDTO,
  UpdateDiscountDTO,
  DiscountResponseDTO,
} from "../dtos/discount.dto";
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
      const result = await insertDiscount(
        discountData.p_id,
        discountData.d_type
      );
      return res.status(200).json({ d_id: result });
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
      await deleteDiscount(discountData.d_id);
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
      const result = await modifyDiscount(
        discountData.d_id,
        discountData.d_type
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
  }
);

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
  }
);

export default router;
