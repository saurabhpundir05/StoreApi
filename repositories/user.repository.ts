//#region imports
import { Users, Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";
//#endregion

//#region User Repository

export class UserRepository extends BaseRepository<Users> {
  constructor(db: Prisma.TransactionClient) {
    super(db, "users");
  }

  //insertUser
  async insertUser(name: string, email: string, password: string) {
    try {
      const check = await this.model.findFirst({
        where: { email },
      });
      if (!check) {
        const insertUser = await this.model.create({
          data: {
            name,
            email,
            password,
            isDeleted: false,
          },
        });
        return insertUser.id;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  //inser user for OAuth
  async insertUserOAuth(name: string, email: string, TokenId: string) {
    try {
      const check = await this.model.findFirst({
        where: { TokenId },
      });
      if (!check) {
        const insertUser = await this.model.create({
          data: {
            name,
            email,
            TokenId,
            isDeleted: false,
          },
        });
        return insertUser.id;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  //get user details by email
  async getUserDetail(email: string) {
    try {
      const checkUserinDb = await this.model.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          isDeleted: true,
        },
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

  //get user detail by id getUserDetailById
  async getUserDetailById(id: number) {
    try {
      const checkUserinDb = await this.model.findUnique({
        where: { id },
        select: {
          name: true,
          password: true,
          isDeleted: true,
        },
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

  //check email already exist in db or not
  async checkUserEmail(email: string) {
    try {
      const checkUserinDb = await this.model.findUnique({
        where: { email },
        select: {
          email: true,
        },
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

  //get user details
  async getUserByGoogleID(TokenId: string) {
    try {
      const checkUserinDb = await this.model.findUnique({
        where: { TokenId },
        select: {
          id: true,
          name: true,
          email: true,
          isDeleted: true,
        },
      });
      return checkUserinDb;
    } catch (err) {
      throw err;
    }
  }

  //update user - name password
  async updateUser(id: number, name: string, email: string, password: string) {
    try {
      const check = await this.model.findFirst({
        where: { id },
      });
      if (check) {
        const updateUser = await this.model.update({
          where: { id },
          data: { name, email, password },
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
//#endregion