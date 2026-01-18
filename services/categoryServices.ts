import { prisma } from "../models/prismaDbConnection";
import { CategoryRepository } from "../repositories/category.repository";
import { CategoryResponseDTO } from "../dtos/category.dto";

//insert category
export const insertNewCategory = async (c_name: string) => {
  const catRepo = new CategoryRepository(prisma);
  const catId = await catRepo.insertNewCategory(c_name);
  if (!catId) return null;
  return catId;
};

//get all category
export const getAllCategories = async (): Promise<CategoryResponseDTO[]> => {
  const prodRepo = new CategoryRepository(prisma);
  return await prodRepo.getAllCategories();
};

//update category name
export const updateCategory = async (
  c_id: number,
  c_name: string
): Promise<number | null> => {
  const catRepo = new CategoryRepository(prisma);
  return await catRepo.updateCategory(c_id, c_name);
};

//delete a category
export const deleteCategory = async (c_id: number): Promise<number | null> => {
  const catRepo = new CategoryRepository(prisma);
  return await catRepo.deleteCategory(c_id);
};
