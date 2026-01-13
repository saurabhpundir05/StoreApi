//dto to add discountvalue
export interface AddDiscountTypeInput {
  d_id: number;
  d_flat?: number | null;
  d_percent?: number | null;
}
export class AddDTO {
  d_id: number;
  d_flat: number | null;
  d_percent: number | null;
  constructor({ d_id, d_flat, d_percent }: AddDiscountTypeInput) {
    this.d_id = d_id;
    this.d_flat = d_flat ?? null;
    this.d_percent = d_percent ?? null;
  }
  validate() {
    if (!this.d_id) {
      throw new Error("d_id is required");
    }
    if (this.d_flat === null && this.d_percent === null) {
      throw new Error("Either d_flat or d_percent is required");
    }
    if (this.d_flat !== null && this.d_percent !== null) {
      throw new Error("Only one of d_flat or d_percent is allowed");
    }
  }
}

//DTO for getting all discounts
export interface Discount {
  d_id: number;
  d_flat: number | null;
  d_percent: number | null;
}
export class DiscountResponseDTO {
  d_id: number;
  d_flat: number | null;
  d_percent: number | null;
  constructor(discounts: Discount) {
    this.d_id = discounts.d_id;
    this.d_flat = discounts.d_flat;
    this.d_percent = discounts.d_percent;
  }
}

// DTO for Deleting Discount Values
export interface DeleteDiscountInput {
  d_id: number;
}
export class DeleteDTO {
  d_id: number;

  constructor({ d_id }: DeleteDiscountInput) {
    this.d_id = d_id;
  }

  validate() {
    if (this.d_id == null) {
      throw new Error("d_id is required");
    }
  }
}
