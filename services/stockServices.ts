import { prisma } from "../models/prismaDbConnection";
import { StockRepository } from "../repositories/stock.repository";

//get all stock
export const getAllStock = async () => {
  const stockRepo = new StockRepository(prisma);
  return stockRepo.getAllStock();
};

//update stock quantity
export const updateStockQuantity = (p_id: number, quantity: number) => {
  const stockRepo = new StockRepository(prisma);
  return stockRepo.updateStockQuantity(p_id, quantity);
};
