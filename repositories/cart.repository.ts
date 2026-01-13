import { prisma } from "../models/prismaDbConnection";
import { BaseRepository } from "./base.repository";
import { CartItemInput, CartResponseDTO } from "../dtos/cart.dto";

export class CartRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.cart);
  }
  // Add items to cart
  async addToCart(items: CartItemInput[]): Promise<any[]> {
    const response: any[] = [];

    for (const item of items) {
      // Find product
      const product = await prisma.product.findFirst({
        where: { p_name: item.p_name },
      });
      if (!product) throw new Error("Product not found");

      // Check stock
      const stock = await prisma.stock.findUnique({
        where: { p_id: product.p_id },
      });
      if (!stock) throw new Error("Stock not available");
      if (Number(stock.quantity) < item.quantity)
        throw new Error("Out of stock");

      // Update stock
      await prisma.stock.update({
        where: { p_id: product.p_id },
        data: { quantity: Number(stock.quantity) - item.quantity },
      });

      // Calculate discount
      const discount = await prisma.discount.findUnique({
        where: { p_id: product.p_id },
      });
      const discountValue = await prisma.discountValues.findFirst({
        where: { d_id: discount?.d_id },
      });

      let d_type = "NO DISCOUNT";
      let d_value = 0;
      const price = Number(product.price);

      if (discount?.d_type) {
        d_type = discount.d_type;
        if (d_type === "FLAT") d_value = Number(discountValue?.d_flat);
        if (d_type === "PERCENT") d_value = Number(discountValue?.d_percent);
      }

      let t_price = price * item.quantity;
      if (d_type === "FLAT") t_price -= d_value;
      if (d_type === "PERCENT") t_price -= (t_price * d_value) / 100;
      if (t_price < 0) t_price = 0;

      // Upsert cart
      await prisma.cart.upsert({
        where: { p_id: product.p_id },
        update: {
          quantity: item.quantity,
          d_type,
          d_value,
          t_price,
        },
        create: {
          p_id: product.p_id,
          p_name: product.p_name,
          price,
          quantity: item.quantity,
          d_type,
          d_value,
          t_price,
        },
      });

      response.push({
        p_name: item.p_name,
        success: true,
        total_price: t_price,
      });
    }

    return response;
  }

  //Delete all cart records
  async deleteAllRecords(): Promise<any> {
    return this.model.deleteMany({});
  }

  //Display all cart details
  async getAllDetails(): Promise<CartResponseDTO[]> {
    const cart: any[] = await this.model.findMany();
    return cart.map(
      (c) =>
        new CartResponseDTO({
          c_id: c.c_id,
          p_id: c.p_id,
          p_name: c.p_name,
          price: c.price,
          quantity: c.quantity,
          d_type: c.d_type,
          d_value: c.d_value,
          t_price: c.t_price,
        })
    );
  }
}
