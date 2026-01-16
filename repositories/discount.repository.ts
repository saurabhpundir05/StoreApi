import { Discount, Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";
import { DiscountResponseDTO } from "../dtos/discount.dto";

export class DiscountRepository extends BaseRepository<Discount> {
  constructor(db: Prisma.TransactionClient) {
    super(db, "discount");
  }

  //insert discount
  async insertDiscount(
    p_id: number,
    d_type: "FLAT" | "PERCENT"
  ): Promise<number> {
    const discount = await this.model.create({
      data: { p_id, d_type },
    });
    return discount.d_id;
  }

  //display all discounts
  async getAllDiscounts(): Promise<DiscountResponseDTO[]> {
    const discounts: any[] = await this.model.findMany();
    return discounts.map(
      (d) =>
        new DiscountResponseDTO({
          d_id: d.d_id,
          p_id: d.p_id,
          d_type: d.d_type,
        })
    );
  }

  //get a discount
  async getADiscount(p_id: number) {
    return await this.model.findUnique({
      where: { p_id },
      select: { d_id: true, d_type: true },
    });
  }

  //update discount d_type
  async modifyDiscount(
    d_id: number,
    d_type: "FLAT" | "PERCENT"
  ): Promise<{ message: string; d_id: number } | null> {
    const result = await this.model.updateMany({
      where: { d_id },
      data: { d_type },
    });

    if (result.count === 0) return null;
    return { message: "Discount type updated successfully", d_id };
  }

  //delete discount
  async deleteDiscount(d_id: number): Promise<void> {
    const deleted = await this.model.deleteMany({ where: { d_id } });
    if (deleted.count === 0) {
      throw new Error("Discount not found");
    }
  }
}
