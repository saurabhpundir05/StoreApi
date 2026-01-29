//#region imports
import { Stock, Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";
import { StockResponseDTO } from "../dtos/stock.dto";
//#endregion

//#region Stock Repository
export class StockRepository extends BaseRepository<Stock> {
  constructor(db: Prisma.TransactionClient) {
    super(db, "stock");
  }

  //create stock
  async insertStock(p_id: number, quantity: number) {
    try {
      const check = await this.model.findFirst({ where: { p_id } });
      if (!check) {
        const insertStock = await this.model.create({
          data: { p_id, quantity },
        });
        return insertStock.s_id;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  //display all stock table data
  async getAllStock(): Promise<StockResponseDTO[]> {
    try {
      const stock: any[] = await this.model.findMany();
      return stock.map(
        (s) =>
          new StockResponseDTO({
            p_id: s.p_id,
            quantity: s.quantity,
          }),
      );
    } catch (err) {
      throw err;
    }
  }

  //get a stock
  async getOneStock(p_id: number): Promise<number | null> {
    const stock = await this.model.findFirst({
      where: { p_id },
      select: { quantity: true },
    });
    return stock ? stock.quantity : null;
  }

  //update stock -quantity
  async updateStockQuantity(
    p_id: number,
    quantity: number,
  ): Promise<{ p_id: number } | null> {
    return await this.model.update({
      where: { p_id },
      data: { quantity },
      select: { p_id: true },
    });
  }

  //delete stock
  async deleteStock(p_id: number) {
    try {
      const check = await this.model.findfirst({ where: { p_id } });
      if (check) {
        const deleteStock = await this.model.deleteMany({
          where: { p_id },
        });
        return deleteStock.p_id;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
}
//#endregion
