export interface Product {
  p_id: number;
  p_name: string;
  price: number;
  c_id: number | null;
}
// DTO for Product Response
export class ProductResponseDTO {
  p_id: number;
  p_name: string;
  price: number;
  c_id: number | null;

  constructor(products: Product) {
    this.p_id = products.p_id;
    this.p_name = products.p_name;
    this.price = products.price;
    this.c_id = products.c_id;
  }
}

// DTO for Adding Product
export interface AddProductInput {
  p_name: string;
  price: number | string;
  c_id?: number | null;
}
export class AddDTO {
  p_name: string;
  price: number;
  c_id: number | null;

  constructor({ p_name, price, c_id }: AddProductInput) {
    this.p_name = p_name?.trim() ?? "";
    this.price = Number(price);
    this.c_id = c_id ?? null;
  }

  validate() {
    if (!this.p_name) {
      throw new Error("Product name is required");
    }
    if (isNaN(this.price) || this.price <= 0) {
      throw new Error("Price must be a positive number");
    }
  }
}

// DTO for Updating Product
export interface UpdateProductInput {
  p_id: number;
  p_name: string;
  price: number;
  c_id?: number | null;
}
export class UpdateDTO {
  p_id: number;
  p_name: string;
  price: number;
  c_id: number | null;

  constructor({ p_id, p_name, price, c_id }: UpdateProductInput) {
    this.p_id = p_id;
    this.p_name = p_name;
    this.price = price;
    this.c_id = c_id ?? null;
  }

  validate() {
    if (this.p_id == null || this.p_name == null || this.price == null) {
      throw new Error("p_id, name, and price are required");
    }
    // c_id can be null, so no need to validate it
  }
}

// DTO for Deleting Product
export interface DeleteProductInput {
  p_id: number;
}
export class DeleteDTO {
  p_id: number;

  constructor({ p_id }: DeleteProductInput) {
    this.p_id = p_id;
  }

  validate() {
    if (this.p_id == null) {
      throw new Error("p_id is required");
    }
  }
}

// DTO for Adding Product to Cart
export interface AddToCartInput {
  p_name: string;
}
export class AddToCartDTO {
  p_name: string;

  constructor({ p_name }: AddToCartInput) {
    this.p_name = p_name;
  }

  validate() {
    if (!this.p_name) {
      throw new Error("p_name is required");
    }
  }
}
