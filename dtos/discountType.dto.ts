export interface AddDiscountTypeInput {
  d_id: number;
  d_flat?: number | null;
  d_percent?: number | null;
}
export class AddDTO {
  id: number;
  flat: number | null;
  percent: number | null;
  constructor({ d_id, d_flat, d_percent }: AddDiscountTypeInput) {
    this.id = d_id;
    this.flat = d_flat ?? null;
    this.percent = d_percent ?? null;
  }
  validate() {
    if (!this.id) {
      throw new Error("d_id is required");
    }
    if (this.flat === null && this.percent === null) {
      throw new Error("Either d_flat or d_percent is required");
    }
    if (this.flat !== null && this.percent !== null) {
      throw new Error("Only one of d_flat or d_percent is allowed");
    }
  }
}
