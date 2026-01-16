import { admin, Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";

export class AdminRepository extends BaseRepository<admin> {
  constructor(db: Prisma.TransactionClient) {
    super(db, "admin");
  }

  //insert admin
  async insertAdmin(id: number, name: string, password: string) {
    try {
      const check = await this.model.findFirst({
        where: { id },
      });
      if (!check) {
        const insertAdmin = await this.model.create({
          data: { id, name, password, isDeleted: false },
        });
        return insertAdmin.id;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  //get admin details
  async getAdminDetail(id: number) {
    try {
      const checkAdminInDb = await this.model.findUnique({
        where: { id },
        select: { id: true, name: true, password: true, isDeleted: true },
      });
      if (checkAdminInDb) {
        return checkAdminInDb;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  //update admin - name password
  async updateAdmin(id: number, name: string, password: string) {
    try {
      const check = await this.model.findFirst({
        where: { id },
      });
      if (check) {
        const updateAdmin = await this.model.update({
          where: { id },
          data: { name, password },
          select: { id: true },
        });
        return updateAdmin.id;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  // Hard delete user
  async deleteAdmin(id: number) {
    try {
      const check = await this.model.findFirst({
        where: { id },
      });
      if (check) {
        const deleteAdmin = await this.model.delete({
          where: { id },
          select: { id: true },
        });
        return deleteAdmin.id;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  // Soft delete admin
  async softDeleteAdmin(id: number) {
    try {
      const check = await this.model.findFirst({
        where: { id, isDeleted: false },
      });
      if (check) {
        const softDeleteAdmin = await this.model.update({
          where: { id },
          data: { isDeleted: true },
          select: { id: true },
        });
        return softDeleteAdmin.id;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
}
