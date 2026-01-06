import express, { Router, Request, Response } from "express";
import { insertDiscountsTypes } from "../services/discountTypeServices";
import { AddDTO } from "../dtos/discountType.dto";
import checkAuthUsingJwt from "../middleware/checkAuth";
const router: Router = express.Router();

//add discount types
router.post(
  "/addDiscountType",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const dto = new AddDTO(req.body);
      const result = await insertDiscountsTypes(dto);
      return res.status(201).json({
        message: "Discount type added successfully",
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
