//#region imports
import { prisma } from "../models/prisma";
import { DiscountValuesRepository } from "../repositories/discount.values.repository";
import { AddDTO } from "../dtos/discount-values.dto";
//#endregion

//#region Services

//add discount type
export const insertDiscountValue = async (
  d_id: number,
  d_flat: number | null = null,
  d_percent: number | null = null,
): Promise<number> => {
  const disRepo = new DiscountValuesRepository(prisma);
  return await disRepo.insertDiscountValue(
    d_id,
    d_flat ?? null,
    d_percent ?? null,
  );
};

//get all discount type
export const getAllDiscountValues = async () => {
  const disRepo = new DiscountValuesRepository(prisma);
  return await disRepo.getAllDiscountValues();
};

//update discount values
export const updateDiscountValues = async (
  d_id: number,
  d_flat: number | null = null,
  d_percent: number | null = null,
) => {
  const disRepo = new DiscountValuesRepository(prisma);
  const dto = new AddDTO({ d_id, d_flat, d_percent });
  return await disRepo.updateDiscountValues(dto);
};

//#endregion
