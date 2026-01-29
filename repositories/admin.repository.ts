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
        return insertAdmin.id;
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
        return insertAdmin.id;
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

  //get admin details by id
  async getAdminDetailById(id: string) {
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

  //get admin details by googleId
  async getAdminByGoogleID(TokenId: string) {
    try {
      const checkAdmin = await this.model.findUnique({
        where: { TokenId },
        select: {
          id: true,
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
  async updateAdmin(id: string, email: string, name: string, password: string) {
    try {
      const check = await this.model.findFirst({
        where: { id },
      });
      if (check) {
        const updateAdmin = await this.model.update({
          where: { id },
          data: { name, email, password },
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
  async deleteAdmin(id: string) {
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
  async softDeleteAdmin(id: string) {
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
//#endregion
