import { Cart, Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";
import { CartResponseDTO } from "../dtos/cart.dto";

export class CartRepository extends BaseRepository<Cart> {
  constructor(db: Prisma.TransactionClient) {
    super(db, "cart");
  }

  //insert into cart
  async insertData(
    p_id: number,
    p_name: string,
    price: number,
    quantity: number,
    d_type: string,
    d_value: number,
    t_price: number
  ) {
    return await this.model.create({
      data: {
        p_id,
        p_name,
        price,
        quantity,
        d_type,
        d_value,
        t_price,
      },
    });
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

  //Delete all cart records
  async deleteAllRecords(): Promise<any> {
    return this.model.deleteMany({});
  }
}
