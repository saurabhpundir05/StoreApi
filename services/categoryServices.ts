import { prisma } from "../models/prismaDbConnection";
import { CategoryResponseDTO } from "../dtos/category.dto";

//insert new category
export const insertNewCategories = async (c_name: string) => {
  try {
    const category = await prisma.category.create({
      data: {
        c_name: c_name,
      },
    });
    return category;
  } catch (err) {
    throw err;
  }
};

// delete category
export const deleteCategories = async (c_id: number): Promise<void> => {
  try {
    const deleted = await prisma.category.deleteMany({
      where: { c_id: c_id },
    });
    if (deleted.count === 0) {
      throw new Error("Category not found");
    }
  } catch (err) {
    throw err;
  }
};

//update existing category
export const updateCategories = async (c_id: number, c_name: string) => {
  try {
    const updated = await prisma.category.update({
      where: { c_id: c_id },
      data: { c_name: c_name },
    });
    return { message: "Category updated successfully", c_id };
  } catch (err) {
    throw err;
  }
};

//get all categories
export const getAllCategories = async (): Promise<CategoryResponseDTO[]> => {
  const categories = await prisma.category.findMany();
  return categories.map((p) => new CategoryResponseDTO(p as any));
};
