//#region imports
import { Cart, Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";
import { CartResponseDTO } from "../dtos/cart.dto";
//#endregion

//#region Cart Repository

export class CartRepository extends BaseRepository<Cart> {
  constructor(db: Prisma.TransactionClient) {
    super(db, "cart");
  }

  //insert into cart
  async insertData(
    id: string,
    p_id: number,
    p_name: string,
    price: number,
    quantity: number,
    d_type: string,
    d_value: number,
    t_price: number,
    d_price: number,
  ) {
    return await this.model.create({
      data: {
        id,
        p_id,
        p_name,
        price,
        quantity,
        d_type,
        d_value,
        t_price,
        d_price,
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
          id: c.id,
          p_id: c.p_id,
          p_name: c.p_name,
          price: c.price,
          quantity: c.quantity,
          d_type: c.d_type,
          d_value: c.d_value,
          t_price: c.t_price,
          d_price: c.d_price,
          createdAt: c.createdAt,
        }),
    );
  }

  //get cart details by user id
  async getAllPersonDetails(id: string): Promise<CartResponseDTO[]> {
    const cart: any[] = await this.model.findMany({
      where: { id: id },
    });
    return cart.map(
      (c) =>
        new CartResponseDTO({
          c_id: c.c_id,
          id: c.id,
          p_id: c.p_id,
          p_name: c.p_name,
          price: c.price,
          quantity: c.quantity,
          d_type: c.d_type,
          d_value: c.d_value,
          t_price: c.t_price,
          d_price: c.d_price,
          createdAt: c.createdAt,
        }),
    );
  }

  //Delete all cart records
  async deleteAllRecords(): Promise<any> {
    return this.model.deleteMany({});
  }
}
//#endregion
