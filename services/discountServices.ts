//#region imports
import { prisma } from "../models/prismaDbConnection";
import { DiscountRepository } from "../repositories/discount.repository";
import { DiscountResponseDTO } from "../dtos/discount.dto";
import { DiscountType } from "../generated/prisma/client";
//#endregion

//#region Services
//add discount ->insert discount type on product by taking product id as input. discount type is FLAT or PERCENT
export const insertDiscount = async (
  p_id: number,
  d_type: DiscountType,
): Promise<number> => {
  const disRepo = new DiscountRepository(prisma);
  return await disRepo.insertDiscount(p_id, d_type);
};

//get all discount -> displays all discount table values.
//discount id, discount type
export const getAllDiscounts = async (): Promise<DiscountResponseDTO[]> => {
  const disRepo = new DiscountRepository(prisma);
  return await disRepo.getAllDiscounts();
};

//update discount type -> updates discount type by first checking if the discount exists.
//if exists then update the discount type from PERCENT to FLAT or FLAT to PERCENT
export const modifyDiscount = async (
  d_id: number,
  d_type: DiscountType,
): Promise<{ message: string; d_id: number } | null> => {
  const disRepo = new DiscountRepository(prisma);
  return await disRepo.modifyDiscount(d_id, d_type);
};

//delete discount -> deletes discount type of discount table by using id
export const deleteDiscount = async (d_id: number) => {
  const disRepo = new DiscountRepository(prisma);
  return await disRepo.deleteDiscount(d_id);
};
//#endregion