import { Prisma } from "../generated/prisma/client";
// Define a generic base repository class that can handle CRUD operations for any type T
export class BaseRepository<T> {
  constructor(
    // Injecting a Prisma transaction client to interact with the database
    protected readonly db: Prisma.TransactionClient,
    // The name of the model (table) this repository works with, e.g., 'user', 'product'.
    // Uncapitalize ensures the first letter is lowercase
    protected readonly modelName: Uncapitalize<Prisma.ModelName>
  ) {}

  // A getter to dynamically access the Prisma model based on modelName
  protected get model() {
    // Using 'any' to bypass TypeScript type checks, so we can access the model dynamically
    return (this.db as any)[this.modelName];
  }

  async findById(id: number): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: number, data: any): Promise<T> {
    return this.model.updateMany({ where: { id }, data });
  }

  async delete(id: number): Promise<T> {
    return this.model.delete({ where: { id } });
  }
}
