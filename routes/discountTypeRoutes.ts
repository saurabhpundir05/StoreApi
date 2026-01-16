import express, { Router, Request, Response } from "express";
import {
  insertDiscountValue,
  getAllDiscountValues,
  updateDiscountValues,
} from "../services/discountTypeServices";
import { AddDTO, DiscountResponseDTO } from "../dtos/discountType.dto";
import checkAuthUsingJwt from "../middleware/checkAuth";
const router: Router = express.Router();

//add discount types
router.post(
  "/addDiscountType",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const dto = new AddDTO(req.body);
      dto.validate();
      const result = await insertDiscountValue(
        dto.d_id,
        dto.d_flat,
        dto.d_percent
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
  }
);

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
  }
);

//modify discountvalue
router.patch(
  "/modifyDiscountValues",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const updateData = new AddDTO(req.body);
      const result = await updateDiscountValues(
        updateData.d_id,
        updateData.d_flat,
        updateData.d_percent
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
  }
);

export default router;
