import { prisma } from "../models/prismaDbConnection";
import { BaseRepository } from "./base.repository";
import { ProductResponseDTO } from "../dtos/product.dto";

export class ProductRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.product);
  }

  //Add a new product or increment stock if it exists
  async addNewProduct(
    p_name: string,
    price: number,
    c_id: number | null = null
  ): Promise<{ product_id: number }> {
    return prisma.$transaction(async (tx) => {
      // Check if product exists
      let productEntry = await tx.product.findFirst({ where: { p_name } });

      if (!productEntry) {
        // Create new product
        productEntry = await tx.product.create({
          data: { p_name, price, c_id },
        });

        // Create initial stock entry
        await tx.stock.create({
          data: { p_id: productEntry.p_id, quantity: 1 },
        });
      } else {
        // Product exists → increment stock
        const stockEntry = await tx.stock.findUnique({
          where: { p_id: productEntry.p_id },
        });

        if (stockEntry) {
          await tx.stock.update({
            where: { p_id: productEntry.p_id },
            data: { quantity: stockEntry.quantity + 1 },
          });
        } else {
          await tx.stock.create({
            data: { p_id: productEntry.p_id, quantity: 1 },
          });
        }
      }

      return { product_id: productEntry.p_id };
    });
  }

  async getAllProductDetails(): Promise<ProductResponseDTO[]> {
    const products: any[] = await this.model.findMany();
    return products.map(
      (p) =>
        new ProductResponseDTO({
          p_id: p.p_id,
          p_name: p.p_name,
          price: p.price,
          c_id: p.c_id ?? null,
        })
    );
  }

  async updateProduct(
    p_id: number,
    p_name: string,
    price: number,
    c_id: number | null = null
  ): Promise<{ message: string; p_id: number } | null> {
    const updatedProduct = await this.model.updateMany({
      where: { p_id },
      data: { p_name, price, c_id },
    });

    if (updatedProduct.count === 0) return null;

    return { message: "Product updated successfully", p_id };
  }

  async deleteProductDetails(
    p_id: number
  ): Promise<{ message: string; p_id: number } | null> {
    return prisma.$transaction(async (tx) => {
      // Adjust stock if exists
      const stockEntry = await tx.stock.findUnique({ where: { p_id } });
      if (stockEntry) {
        await tx.stock.update({
          where: { p_id },
          data: { quantity: Math.max(stockEntry.quantity - 1, 0) },
        });
      }

      const deletedProduct = await tx.product.deleteMany({ where: { p_id } });

      if (deletedProduct.count === 0) return null;

      return { message: "Product deleted successfully", p_id };
    });
  }
}
