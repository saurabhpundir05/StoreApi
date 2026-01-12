// src/repositories/stock.repository.ts
import { prisma } from "../models/prismaDbConnection";
import { BaseRepository } from "./base.repository";
import { StockResponseDTO } from "../dtos/stock.dto";

export class StockRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.stock);
  }

  async updateStockQuantity(p_id: number, quantity: number): Promise<any> {
    try {
      const updatedStock = await this.model.update({
        where: { p_id },
        data: { quantity },
      });
      return updatedStock;
    } catch (err) {
      throw err;
    }
  }

  async getAllStock(): Promise<StockResponseDTO[]> {
    const stock: any[] = await this.model.findMany();
    return stock.map(
      (s) =>
        new StockResponseDTO({
          p_id: s.p_id,
          quantity: s.quantity,
        })
    );
  }
}
