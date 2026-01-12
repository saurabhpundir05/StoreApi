import { ProductRepository } from "../repositories/product.repository";
import { ProductResponseDTO } from "../dtos/product.dto";

const productRepo = new ProductRepository();

export const addNewProduct = (p_name: string, price: number, c_id?: number) =>
  productRepo.addNewProduct(p_name, price, c_id);

export const getAllProductDetails = (): Promise<ProductResponseDTO[]> =>
  productRepo.getAllProductDetails();

export const updateProduct = (
  p_id: number,
  p_name: string,
  price: number,
  c_id?: number
) => productRepo.updateProduct(p_id, p_name, price, c_id);

export const deleteProductDetails = (p_id: number) =>
  productRepo.deleteProductDetails(p_id);
