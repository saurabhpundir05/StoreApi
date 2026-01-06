// DTO for Adding Discount
export interface AddDiscountInput {
  p_id: number;
  d_type: "FLAT" | "PERCENT";
}

export class AddDTO {
  id: number;
  type: "FLAT" | "PERCENT";
  constructor({ p_id, d_type }: AddDiscountInput) {
    this.id = p_id;
    this.type = d_type;
  }
  validate() {
    if (!this.id || !this.type) {
      throw new Error("p_id and d_type are required");
    }
  }
}

// DTO for Deleting Discount
export interface DeleteDiscountInput {
  d_id: number;
}
export class DeleteDTO {
  id: number;
  constructor({ d_id }: DeleteDiscountInput) {
    this.id = d_id;
  }
  validate() {
    if (!this.id) {
      throw new Error("d_id is required");
    }
  }
}

// DTO for Updating Discount
export interface UpdateDiscountInput {
  d_id: number; // discount ID
  d_type: "FLAT" | "PERCENT"; // discount type
}

export class UpdateDiscountDTO {
  id: number;
  type: "FLAT" | "PERCENT";

  constructor({ d_id, d_type }: UpdateDiscountInput) {
    this.id = d_id;
    this.type = d_type;
  }

  validate() {
    if (!this.id || !this.type) {
      throw new Error("d_id and d_type are required");
    }
  }
}
