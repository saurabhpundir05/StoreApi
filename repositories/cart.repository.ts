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
    userId: number | null,
    adminId: number | null,
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
        userId,
        adminId,
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
          userId: c.userId,
          adminId: c.adminId,
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

  //get cart details by userId
  async getAllUsersDetails(userId: number): Promise<CartResponseDTO[]> {
    const cart: any[] = await this.model.findMany({
      where: { userId: userId },
    });
    return cart.map(
      (c) =>
        new CartResponseDTO({
          c_id: c.c_id,
          userId: c.userId,
          adminId: c.adminId,
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

  //get cart details by userId
  async getAllAdminDetails(adminId: number): Promise<CartResponseDTO[]> {
    const cart: any[] = await this.model.findMany({
      where: { adminId: adminId },
    });
    return cart.map(
      (c) =>
        new CartResponseDTO({
          c_id: c.c_id,
          userId: c.userId,
          adminId: c.adminId,
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
