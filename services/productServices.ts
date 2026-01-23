//#region imports
import { prisma } from "../models/prismaDbConnection";
import { ProductRepository } from "../repositories/product.repository";
import { ProductResponseDTO } from "../dtos/product.dto";
import { UnitOfWork } from "../repositories/unitofwork";
//#endregion

//#region Services

const uow = new UnitOfWork();

//insert product
export const insertProduct = async (
  p_name: string,
  price: number,
  c_id: number | null = null,
): Promise<number | null> => {
  return await uow.execute(async (repos) => {
    const productId = await repos.products.insertProduct(p_name, price, c_id);
    if (!productId) {
      return null;
    }
    const quantity = await repos.stocks.getOneStock(productId);
    if (quantity === null) {
      await repos.stocks.insertStock(productId, 1);
    }
    return productId;
  });
};

//get all product
export const getAllProductDetails = async (): Promise<ProductResponseDTO[]> => {
  // Create a new instance of ProductRepository and assign it to the variable 'prodRepo'
  // 'prisma' is the Prisma client (or a Prisma TransactionClient) used to interact with the database
  // This instance now has all CRUD methods for the 'Product' model
  const prodRepo = new ProductRepository(prisma);
  return await prodRepo.getAllProductDetails();
};

//update product name price c_id
export const updateProduct = async (
  p_id: number,
  p_name: string,
  price: number,
  c_id: number | null = null,
): Promise<number | null> => {
  const prodRepo = new ProductRepository(prisma);
  const productId = await prodRepo.updateProduct(p_id, p_name, price, c_id);
  if (!productId) return null;
  return productId;
};

//delete product
export const deleteProduct = async (p_id: number) => {
  const prodRepo = new ProductRepository(prisma);
  const productId = await prodRepo.deleteProduct(p_id);
  if (!productId) return null;
  return productId;
};
//#endregion