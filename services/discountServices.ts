import { prisma } from "../models/prismaDbConnection";
import { DiscountRepository } from "../repositories/discount.repository";
import { DiscountResponseDTO } from "../dtos/discount.dto";

//add discount
export const insertDiscount = async (
  p_id: number,
<<<<<<< HEAD
  d_type?: "FLAT" | "PERCENT"
=======
  d_type: "FLAT" | "PERCENT"
>>>>>>> 6d59a2926b1398f735eb5d8c6a583c7a45495553
): Promise<number> => {
  const disRepo = new DiscountRepository(prisma);
  return await disRepo.insertDiscount(p_id, d_type);
};

//get all discount
export const getAllDiscounts = async (): Promise<DiscountResponseDTO[]> => {
  const disRepo = new DiscountRepository(prisma);
  return await disRepo.getAllDiscounts();
};

//update discount type
export const modifyDiscount = async (
  d_id: number,
  d_type: "FLAT" | "PERCENT"
): Promise<{ message: string; d_id: number } | null> => {
  const disRepo = new DiscountRepository(prisma);
  return await disRepo.modifyDiscount(d_id, d_type);
};

//delete discount
export const deleteDiscount = async (d_id: number) => {
  const disRepo = new DiscountRepository(prisma);
  return await disRepo.deleteDiscount(d_id);
};
