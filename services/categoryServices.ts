import { prisma } from "../models/prismaDbConnection";

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
