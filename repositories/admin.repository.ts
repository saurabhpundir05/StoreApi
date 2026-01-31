//#region imports
import { Admin, Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";
//#endregion

//#region admin repository

export class AdminRepository extends BaseRepository<Admin> {
  constructor(db: Prisma.TransactionClient) {
    super(db, "admin");
  }

  //insert admin
  async insertAdmin(email: string, name: string, password: string) {
    try {
      const check = await this.model.findFirst({
        where: { email },
      });
      if (!check) {
        const insertAdmin = await this.model.create({
          data: { email, name, password, isDeleted: false },
        });
        return insertAdmin.adminId;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  //insert admin for OAuth
  async insertAdminOAuth(name: string, email: string, TokenId: string) {
    try {
      const check = await this.model.findFirst({
        where: { TokenId },
      });
      if (!check) {
        const insertAdmin = await this.model.create({
          data: {
            name,
            email,
            TokenId,
            isDeleted: false,
          },
        });
        return insertAdmin.adminId;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  //get admin details
  async getAdminDetail(email: string) {
    try {
      const checkAdminInDb = await this.model.findUnique({
        where: { email },
        select: { adminId: true, name: true, password: true, isDeleted: true },
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

  //get admin details by id
  async getAdminDetailById(adminId: number) {
    try {
      const checkAdminInDb = await this.model.findUnique({
        where: { adminId },
        select: { adminId: true, name: true, password: true, isDeleted: true },
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

  //get admin details by googleId
  async getAdminByGoogleID(TokenId: string) {
    try {
      const checkAdmin = await this.model.findUnique({
        where: { TokenId },
        select: {
          adminId: true,
          name: true,
          email: true,
          isDeleted: true,
        },
      });
      return checkAdmin;
    } catch (err) {
      throw err;
    }
  }

  //update admin - name password
  async updateAdmin(
    adminId: number,
    email: string,
    name: string,
    password: string,
  ) {
    try {
      const check = await this.model.findFirst({
        where: { adminId },
      });
      if (check) {
        const updateAdmin = await this.model.update({
          where: { adminId },
          data: { name, email, password },
          select: { adminId: true },
        });
        return updateAdmin.adminId;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  // Hard delete user
  async deleteAdmin(adminId: number) {
    try {
      const check = await this.model.findFirst({
        where: { adminId },
      });
      if (check) {
        const deleteAdmin = await this.model.delete({
          where: { adminId },
          select: { adminId: true },
        });
        return deleteAdmin.adminId;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  // Soft delete admin
  async softDeleteAdmin(adminId: number) {
    try {
      const check = await this.model.findFirst({
        where: { adminId, isDeleted: false },
      });
      if (check) {
        const softDeleteAdmin = await this.model.update({
          where: { adminId },
          data: { isDeleted: true },
          select: { adminId: true },
        });
        return softDeleteAdmin.adminId;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
}
//#endregion
