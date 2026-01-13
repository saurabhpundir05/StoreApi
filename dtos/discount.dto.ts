// DTO for Adding Discount
export interface AddDiscountInput {
  p_id: number;
  d_type: "FLAT" | "PERCENT";
}
export class AddDTO {
  p_id: number;
  d_type: "FLAT" | "PERCENT";
  constructor({ p_id, d_type }: AddDiscountInput) {
    this.p_id = p_id;
    this.d_type = d_type;
  }
  validate() {
    if (!this.p_id || !this.d_type) {
      throw new Error("p_id and d_type are required");
    }
  }
}

// DTO for Deleting Discount
export interface DeleteDiscountInput {
  d_id: number;
}
export class DeleteDTO {
  d_id: number;
  constructor({ d_id }: DeleteDiscountInput) {
    this.d_id = d_id;
  }
  validate() {
    if (!this.d_id) {
      throw new Error("d_id is required");
    }
  }
}

// DTO for Updating Discount
export interface UpdateDiscountInput {
  d_id: number;
  d_type: "FLAT" | "PERCENT";
}
export class UpdateDiscountDTO {
  d_id: number;
  d_type: "FLAT" | "PERCENT";

  constructor({ d_id, d_type }: UpdateDiscountInput) {
    this.d_id = d_id;
    this.d_type = d_type;
  }

  validate() {
    if (!this.d_id || !this.d_type) {
      throw new Error("d_id and d_type are required");
    }
  }
}

//DTO for getting all discounts
export interface Discount {
  d_id: number;
  p_id: number;
  d_type: string | null;
}
export class DiscountResponseDTO {
  d_id: number;
  p_id: number;
  d_type: string | null;
  constructor(discounts: Discount) {
    this.d_id = discounts.p_id;
    this.p_id = discounts.p_id;
    this.d_type = discounts.d_type;
  }
}
