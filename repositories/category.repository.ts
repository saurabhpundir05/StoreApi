import { prisma } from "../models/prismaDbConnection";
import { BaseRepository } from "./base.repository";
import { CategoryResponseDTO } from "../dtos/category.dto";

export class CategoryRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.category);
  }

  async insertNewCategory(c_name: string): Promise<any> {
    return this.model.create({
      data: { c_name },
    });
  }

  async deleteCategory(c_id: number): Promise<void> {
    const deleted = await this.model.deleteMany({ where: { c_id } });
    if (deleted.count === 0) {
      throw new Error("Category not found");
    }
  }

  async updateCategory(
    c_id: number,
    c_name: string
  ): Promise<{ message: string; c_id: number }> {
    await this.model.update({
      where: { c_id },
      data: { c_name },
    });
    return { message: "Category updated successfully", c_id };
  }

  async getAllCategories(): Promise<CategoryResponseDTO[]> {
    const categories: any[] = await this.model.findMany();
    return categories.map(
      (c) =>
        new CategoryResponseDTO({
          c_id: c.c_id,
          c_name: c.c_name,
        })
    );
  }
}
