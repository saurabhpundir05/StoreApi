import { Users, Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<Users> {
  constructor(db: Prisma.TransactionClient) {
    super(db, "users");
  }

  //insertUser
  async insertUser(id: number, name: string, password: string) {
    try {
      const check = await this.model.findFirst({
        where: { id },
      });
      if (!check) {
        const insertUser = await this.model.create({
          data: { id, name, password, isDeleted: false },
        });
        return insertUser.id;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  //get user details
  async getUserDetail(id: number) {
    try {
      const checkUserinDb = await this.model.findUnique({
        where: { id },
        select: { id: true, name: true, password: true, isDeleted: true },
      });
      if (checkUserinDb) {
        return checkUserinDb;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  //update user - name password
  async updateUser(id: number, name: string, password: string) {
    try {
      const check = await this.model.findFirst({
        where: { id },
      });
      if (check) {
        const updateUser = await this.model.update({
          where: { id },
          data: { name, password },
          select: { id: true },
        });
        return updateUser.id;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  // Hard delete user
  async deleteUser(id: number) {
    try {
      const check = await this.model.findFirst({
        where: { id },
      });
      if (check) {
        const deleteUser = await this.model.delete({
          where: { id },
          select: { id: true },
        });
        return deleteUser.id;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  // Soft delete user
  async softDeleteUser(id: number) {
    try {
      const check = await this.model.findFirst({
        where: { id, isDeleted: false },
      });
      if (check) {
        const deleteUser = await this.model.update({
          where: { id },
          data: { isDeleted: true },
          select: { id: true },
        });
        return deleteUser.id;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
}
