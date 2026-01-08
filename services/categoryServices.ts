import { prisma } from "../models/prismaDbConnection";
import { CategoryResponseDTO } from "../dtos/category.dto";

//insert new category
export const insertNewCategories = async (name: string) => {
  try {
    const category = await prisma.category.create({
      data: {
        c_name: name,
      },
    });
    return category;
  } catch (err) {
    throw err;
  }
};

// delete category
export const deleteCategories = async (id: number): Promise<void> => {
  try {
    const deleted = await prisma.category.deleteMany({
      where: { c_id: id },
    });
    if (deleted.count === 0) {
      throw new Error("Category not found");
    }
  } catch (err) {
    throw err;
  }
};

//update existing category
export const updateCategories = async (id: number, name: string) => {
  try {
    const updated = await prisma.category.update({
      where: { c_id: id },
      data: { c_name: name },
    });
    return { message: "Category updated successfully", id };
  } catch (err) {
    throw err;
  }
};

//get all categories
export const getAllCategories = async (): Promise<CategoryResponseDTO[]> => {
  const categories = await prisma.category.findMany();
  return categories.map((p) => new CategoryResponseDTO(p as any));
};
