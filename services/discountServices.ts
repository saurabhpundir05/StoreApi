import { DiscountRepository } from "../repositories/discount.repository";
import { DiscountResponseDTO } from "../dtos/discount.dto";

const discountRepo = new DiscountRepository();

export const insertDiscount = (p_id: number, d_type: "FLAT" | "PERCENT") =>
  discountRepo.insertDiscount(p_id, d_type);

export const deleteDiscount = (d_id: number) =>
  discountRepo.deleteDiscount(d_id);

export const modifyDiscount = (d_id: number, d_type: "FLAT" | "PERCENT") =>
  discountRepo.modifyDiscount(d_id, d_type);

export const getAllDiscounts = (): Promise<DiscountResponseDTO[]> =>
  discountRepo.getAllDiscounts();
