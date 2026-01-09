import { prisma } from "../models/prismaDbConnection";

//insert discounts on products
export const insertDiscounts = async (
  p_id: number,
  d_type: "FLAT" | "PERCENT"
) => {
  try {
    const discount = await prisma.discount.create({
      data: {
        p_id: p_id,
        d_type: d_type,
      },
    });
    return discount;
  } catch (err) {
    throw err;
  }
};

//delete discounts on products
export const deleteDiscounts = async (d_id: number): Promise<void> => {
  try {
    const deleted = await prisma.discount.deleteMany({
      where: { d_id: d_id },
    });
    if (deleted.count === 0) {
      throw new Error("Discount not found");
    }
  } catch (err) {
    throw err;
  }
};

//modify discount on products
export const modifyDiscount = async (
  d_id: number,
  d_type: "FLAT" | "PERCENT"
): Promise<{ message: string; d_id: number } | null> => {
  try {
    const result = await prisma.discount.updateMany({
      where: { d_id },
      data: { d_type },
    });
    if (result.count === 0) {
      return null; // No discount found to update
    }
    return { message: "Discount type updated successfully", d_id };
  } catch (err) {
    throw err;
  }
};
