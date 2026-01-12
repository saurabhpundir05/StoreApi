import { CategoryRepository } from "../repositories/category.repository";
import { CategoryResponseDTO } from "../dtos/category.dto";

const categoryRepo = new CategoryRepository();

export const insertNewCategory = (c_name: string) =>
  categoryRepo.insertNewCategory(c_name);

export const deleteCategory = (c_id: number) =>
  categoryRepo.deleteCategory(c_id);

export const updateCategory = (c_id: number, c_name: string) =>
  categoryRepo.updateCategory(c_id, c_name);

export const getAllCategories = (): Promise<CategoryResponseDTO[]> =>
  categoryRepo.getAllCategories();
