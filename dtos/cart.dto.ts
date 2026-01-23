// DTO for Cart Response
export interface Cart {
  c_id: number;
  id: number;
  p_id: number;
  p_name: string;
  price: number;
  quantity: number;
  d_type: string | null;
  d_value: number | null;
  t_price: number;
  d_price: number;
  createdAt: Date;
}

export class CartResponseDTO {
  c_id: number;
  id: number;
  p_id: number;
  p_name: string;
  price: number;
  quantity: number;
  d_type: string | null;
  d_value: number | null;
  t_price: number;
  d_price: number;
  createdAt: Date;

  constructor(cart: Cart) {
    this.c_id = cart.c_id;
    this.id = cart.id;
    this.p_id = cart.p_id;
    this.p_name = cart.p_name;
    this.price = cart.price;
    this.quantity = cart.quantity;
    this.d_type = cart.d_type;
    this.d_value = cart.d_value;
    this.t_price = cart.t_price;
    this.d_price = cart.d_price;
    this.createdAt = cart.createdAt;
  }
}

// DTO for insert data in cart
// DTO for a single cart item
export interface CartItemInput {
  id: number;
  p_name: string;
  quantity: number;
}
// DTO for adding multiple items to cart
export class AddCartDTO {
  id: number;
  items: CartItemInput[];
  constructor(data: { id: number; items: CartItemInput[] }) {
    this.id = data.id;
    // Ensure items is always an array
    this.items = Array.isArray(data.items) ? data.items : [];
  }
  validate() {
    if (!this.items || this.items.length === 0) {
      throw new Error("Items array is required");
    }
    for (const item of this.items) {
      if (!item.p_name || typeof item.p_name !== "string") {
        throw new Error("Provide a valid product name");
      }
      if (
        !item.quantity ||
        typeof item.quantity !== "number" ||
        item.quantity <= 0
      ) {
        throw new Error(`Out of Stock: ${item.p_name}`);
      }
    }
  }
}
