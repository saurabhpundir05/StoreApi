import { prisma } from "../models/prismaDbConnection";
import { BaseRepository } from "./base.repository";
import { users } from "../generated/prisma/client";

export class UserRepository extends BaseRepository<users> {
  constructor() {
    super(prisma.users);
  }

  // Find user by ID (select only id)
  async findUserById(id: number): Promise<users | null> {
    return this.model.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  // Login user: get id, name, password
  async loginUser(id: number | string): Promise<users | null> {
    return this.model.findFirst({
      where: {
        id: typeof id === "string" ? Number(id) : id,
        isDeleted: false,
      },
      select: { id: true, name: true, password: true },
    });
  }

  // Hard delete user
  async deleteUser(id: number): Promise<{ affectedRows: number }> {
    const result = await this.model.deleteMany({
      where: { id, isDeleted: false },
    });
    return { affectedRows: result.count };
  }

  // Soft delete user
  async softDeleteUser(id: number): Promise<{ affectedRows: number }> {
    const result = await this.model.updateMany({
      where: { id, isDeleted: false },
      data: { isDeleted: true },
    });
    return { affectedRows: result.count };
  }

  // Update user details (name + password)
  async updateUserDetails(
    id: number,
    name: string,
    password: string
  ): Promise<{ affectedRows: number }> {
    const result = await this.model.updateMany({
      where: { id, isDeleted: false },
      data: { name, password },
    });
    return { affectedRows: result.count };
  }

  // Check if soft-deleted user exists
  async checkSoftDeletedUser(id: number | string): Promise<users | null> {
    return this.model.findFirst({
      where: { id: typeof id === "string" ? Number(id) : id, isDeleted: true },
      select: { id: true, name: true, password: true },
    });
  }

  // Activate soft-deleted user
  async activateSoftDeletedUser(id: number): Promise<{ affectedRows: number }> {
    const result = await this.model.updateMany({
      where: { id, isDeleted: true },
      data: { isDeleted: false },
    });
    return { affectedRows: result.count };
  }

  async findByName(name: string): Promise<users | null> {
    return this.model.findFirst({ where: { name } });
  }
}
