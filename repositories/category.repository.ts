import { Category, Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";
import { CategoryResponseDTO } from "../dtos/category.dto";

export class CategoryRepository extends BaseRepository<Category> {
  constructor(db: Prisma.TransactionClient) {
    super(db, "category");
  }

  //insert new category
  async insertNewCategory(c_name: string): Promise<number | null> {
    try {
      const existingCategory = await this.model.findFirst({
        where: { c_name },
      });
      if (existingCategory) {
        return null;
      }
      const newCategory = await this.model.create({
        data: { c_name },
      });
      return newCategory.c_id;
    } catch (err) {
      throw err;
    }
  }

  //display all categories
  async getAllCategories(): Promise<CategoryResponseDTO[]> {
    try {
      const categories: any[] = await this.model.findMany();
      return categories.map(
        (c) =>
          new CategoryResponseDTO({
            c_id: c.c_id,
            c_name: c.c_name,
          })
      );
    } catch (err) {
      throw err;
    }
  }

  //update category c_name
  async updateCategory(c_id: number, c_name: string): Promise<number | null> {
    try {
      const updatedCategory = await this.model.update({
        where: { c_id },
        data: { c_name },
        select: { c_id: true },
      });
      return updatedCategory.c_id;
    } catch (err) {
      throw err;
    }
  }

  //delete category
  async deleteCategory(c_id: number): Promise<number | null> {
    try {
      const deletedCategory = await this.model.delete({
        where: { c_id },
        select: { c_id: true },
      });
      return deletedCategory.c_id;
    } catch (err) {
      throw err;
    }
  }
}
