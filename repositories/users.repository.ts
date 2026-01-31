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
        return insertUser.userId;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  //insert user for OAuth
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
        return insertUser.userId;
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
          userId: true,
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
  async getUserDetailById(userId: number) {
    try {
      const checkUserinDb = await this.model.findUnique({
        where: { userId },
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
          userId: true,
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
  async updateUser(
    userId: number,
    name: string,
    email: string,
    password: string,
  ) {
    try {
      const check = await this.model.findFirst({
        where: { userId },
      });
      if (check) {
        const updateUser = await this.model.update({
          where: { userId },
          data: { name, email, password },
          select: { userId: true },
        });
        return updateUser.userId;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  // Hard delete user
  async deleteUser(userId: number) {
    try {
      const check = await this.model.findFirst({
        where: { userId },
      });
      if (check) {
        const deleteUser = await this.model.delete({
          where: { userId },
          select: { userId: true },
        });
        return deleteUser.userId;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  // Soft delete user
  async softDeleteUser(userId: number) {
    try {
      const check = await this.model.findFirst({
        where: { userId, isDeleted: false },
      });
      if (check) {
        const deleteUser = await this.model.update({
          where: { userId },
          data: { isDeleted: true },
          select: { userId: true },
        });
        return deleteUser.userId;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
}
//#endregion
