import { StockRepository } from "../repositories/stock.repository";
import { StockResponseDTO } from "../dtos/stock.dto";

const stockRepo = new StockRepository();

export const updateStockQuantity = (p_id: number, quantity: number) =>
  stockRepo.updateStockQuantity(p_id, quantity);

export const getAllStock = (): Promise<StockResponseDTO[]> =>
  stockRepo.getAllStock();
