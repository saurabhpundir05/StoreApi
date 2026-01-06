import { prisma } from "../models/prismaDbConnection";
import { AddDTO } from "../dtos/discountType.dto";

export const insertDiscountsTypes = async (data: AddDTO) => {
  data.validate();
  const prismaData = {
    d_id: data.id,
    d_flat: data.flat ?? null,
    d_percent: data.percent ?? null,
  };
  const discountType = await prisma.discountValues.create({
    data: prismaData,
  });

  return discountType;
};
