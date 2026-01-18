import { Cart, Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";
import { CartResponseDTO } from "../dtos/cart.dto";

export class CartRepository extends BaseRepository<Cart> {
  constructor(db: Prisma.TransactionClient) {
    super(db, "cart");
  }

  //insert into cart
  async insertData(
<<<<<<< HEAD
    id: number,
=======
>>>>>>> 6d59a2926b1398f735eb5d8c6a583c7a45495553
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
<<<<<<< HEAD
        id,
=======
>>>>>>> 6d59a2926b1398f735eb5d8c6a583c7a45495553
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
<<<<<<< HEAD
          id: c.id,
=======
>>>>>>> 6d59a2926b1398f735eb5d8c6a583c7a45495553
          p_id: c.p_id,
          p_name: c.p_name,
          price: c.price,
          quantity: c.quantity,
          d_type: c.d_type,
          d_value: c.d_value,
          t_price: c.t_price,
<<<<<<< HEAD
          createdAt: c.createdAt,
        })
    );
  }

  //get cart details by user id
  async getAllUserDetails(id: number): Promise<CartResponseDTO[]> {
    const cart: any[] = await this.model.findMany({
      where: { id: id },
      // select: { p_name: true },
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
          createdAt: c.createdAt,
=======
>>>>>>> 6d59a2926b1398f735eb5d8c6a583c7a45495553
        })
    );
  }

  //Delete all cart records
  async deleteAllRecords(): Promise<any> {
    return this.model.deleteMany({});
  }
}
