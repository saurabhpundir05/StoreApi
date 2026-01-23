//#region imports
import { Product, Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";
import { ProductResponseDTO } from "../dtos/product.dto";
//#endregion

//#region Product Repository

// Define a repository specifically for the Product model
// It extends BaseRepository with the generic type T = Product
export class ProductRepository extends BaseRepository<Product> {
  // The constructor accepts a Prisma TransactionClient to interact with the database
  constructor(db: Prisma.TransactionClient) {
    // Call the parent BaseRepository constructor
    // Pass the database client and the model name "product"
    // This sets up all the generic CRUD methods for the Product model
    super(db, "product");
  }

  //insert product
  async insertProduct(
    p_name: string,
    price: number,
    c_id: number | null = null,
  ) {
    try {
      const existingProduct = await this.model.findFirst({
        where: { p_name },
      });
      if (existingProduct) {
        return null;
      }
      const newProduct = await this.model.create({
        data: { p_name, price, c_id },
      });
      return newProduct.p_id;
    } catch (err) {
      throw err;
    }
  }

  //get all products
  async getAllProductDetails(): Promise<ProductResponseDTO[]> {
    try {
      const products: any[] = await this.model.findMany();
      return products.map(
        (p) =>
          new ProductResponseDTO({
            p_id: p.p_id,
            p_name: p.p_name,
            price: p.price,
            c_id: p.c_id ?? null,
          }),
      );
    } catch (err) {
      throw err;
    }
  }

  //get a product by name
  async findProduct(p_name: string) {
    return await this.model.findFirst({
      where: { p_name },
      select: {
        p_id: true,
        p_name: true,
        c_id: true,
        price: true,
      },
    });
  }

  //update product
  async updateProduct(
    p_id: number,
    p_name: string,
    price: number,
    c_id: number | null = null,
  ): Promise<number | null> {
    try {
      const updatedProduct = await this.model.update({
        where: { p_id },
        data: { p_name, price, c_id },
        select: { p_id: true },
      });
      return updatedProduct.p_id;
    } catch (err) {
      throw err;
    }
  }

  //delete product
  async deleteProduct(p_id: number): Promise<number | null> {
    try {
      const deletedProduct = await this.model.delete({
        where: { p_id },
        select: { p_id: true },
      });
      return deletedProduct.p_id;
    } catch (err) {
      throw err;
    }
  }
}
//#endregion