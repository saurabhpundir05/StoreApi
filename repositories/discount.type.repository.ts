// src/repositories/discountValues.repository.ts
import { prisma } from "../models/prismaDbConnection";
import { BaseRepository } from "./base.repository";
import { AddDTO, DiscountResponseDTO } from "../dtos/discountType.dto";

export class DiscountValuesRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.discountValues);
  }

  async insertDiscountValues(data: AddDTO): Promise<any> {
    data.validate();

    const prismaData = {
      d_id: data.d_id,
      d_flat: data.d_flat ?? null,
      d_percent: data.d_percent ?? null,
    };

    const discountType = await this.model.create({ data: prismaData });
    return discountType;
  }

  async getAllDiscountValues(): Promise<DiscountResponseDTO[]> {
    const discounts: any[] = await this.model.findMany();
    return discounts.map(
      (d) =>
        new DiscountResponseDTO({
          d_id: d.d_id,
          d_flat: d.d_flat,
          d_percent: d.d_percent,
        })
    );
  }

  async updateDiscountValues(data: AddDTO): Promise<any> {
    data.validate();

    const updated = await this.model.updateMany({
      where: { d_id: data.d_id },
      data: { d_flat: data.d_flat, d_percent: data.d_percent },
    });

    return updated;
  }
}
