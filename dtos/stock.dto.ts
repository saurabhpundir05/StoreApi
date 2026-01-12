// DTO for Updating Stock
export interface UpdateStockInput {
  p_id: number;
  quantity: number;
}
export class UpdateCartDTO {
  p_id: number;
  quantity: number;

  constructor({ p_id, quantity }: UpdateStockInput) {
    this.p_id = p_id;
    this.quantity = quantity;
  }

  validate() {
    if (this.p_id == null || this.quantity == null) {
      throw new Error("p_id and quantity are required");
    }
  }
}

//DTO for stock response
export interface Stock {
  p_id: number;
  quantity: number;
}
export class StockResponseDTO {
  p_id: number;
  quantity: number;
  constructor(stocks: Stock) {
    this.p_id = stocks.p_id;
    this.quantity = stocks.quantity;
  }
}
