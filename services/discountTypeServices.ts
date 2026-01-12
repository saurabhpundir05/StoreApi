import { DiscountValuesRepository } from "../repositories/discount.type.repository";
import { AddDTO, DiscountResponseDTO } from "../dtos/discountType.dto";

const discountValuesRepo = new DiscountValuesRepository();

export const insertDiscountValues = (data: AddDTO) =>
  discountValuesRepo.insertDiscountValues(data);

export const getAllDiscountValues = (): Promise<DiscountResponseDTO[]> =>
  discountValuesRepo.getAllDiscountValues();

export const updateDiscountValues = (data: AddDTO) =>
  discountValuesRepo.updateDiscountValues(data);
