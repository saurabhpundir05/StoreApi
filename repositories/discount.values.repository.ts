//#region imports
import { DiscountType, Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";
import { AddDTO, DiscountResponseDTO } from "../dtos/discount-values.dto";
//#endregion

//#region DiscountType Repository

export class DiscountValuesRepository extends BaseRepository<DiscountType> {
  constructor(db: Prisma.TransactionClient) {
    super(db, "discountValues");
  }

  //insert discount values
  async insertDiscountValue(
    d_id: number,
    d_flat: number | null = null,
    d_percent: number | null = null,
  ): Promise<number> {
    if (d_flat != null && d_percent != null) {
      throw new Error("Cannot have both d_flat and d_percent at the same time");
    }
    const discountValue = await this.model.create({
      data: {
        d_id,
        d_flat: d_flat ?? null,
        d_percent: d_percent ?? null,
      },
    });

    return discountValue.dv_id;
  }

  //display all discount values
  async getAllDiscountValues(): Promise<DiscountResponseDTO[]> {
    const discounts: any[] = await this.model.findMany();
    return discounts.map(
      (d) =>
        new DiscountResponseDTO({
          d_id: d.d_id,
          d_flat: d.d_flat,
          d_percent: d.d_percent,
        }),
    );
  }

  //get a discount value
  async getADiscountValue(d_id: number): Promise<number | null> {
    const discount = await this.model.findUnique({
      where: { d_id },
      select: { d_percent: true, d_flat: true },
    });
    if (!discount) return null;
    return discount.d_percent ?? discount.d_flat ?? null;
  }

  //update discount values d_percent or d_flat
  async updateDiscountValues(data: AddDTO): Promise<any> {
    data.validate();
    const updated = await this.model.updateMany({
      where: { d_id: data.d_id },
      data: { d_flat: data.d_flat, d_percent: data.d_percent },
    });
    return updated;
  }
}
//#endregion
