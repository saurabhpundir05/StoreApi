import { prisma } from "../models/prismaDbConnection";
import { UserRepository } from "../repositories/user.repository";

//signup
export const createNewUser = async (
  id: number,
  name: string,
  password: string
) => {
  const userRepo = new UserRepository(prisma);
  try {
    const createUser = await userRepo.insertUser(id, name, password);
    if (!createUser) {
      return null;
    } else {
      return createUser;
    }
  } catch (error) {
    throw error;
  }
};

//login
export const getUserDetail = async (id: number) => {
  const userRepo = new UserRepository(prisma);
  try {
    const loginUser = await userRepo.getUserDetail(id);
    if (loginUser) {
      return loginUser;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

//update user name and password
export const updateUser = async (
  id: number,
  name: string,
  password: string
) => {
  const userRepo = new UserRepository(prisma);
  try {
    const updateUser = await userRepo.updateUser(id, name, password);
    if (!updateUser) {
      return null;
    } else {
      return updateUser;
    }
  } catch (error) {
    throw error;
  }
};

//hard delete user
export const deleteUser = async (id: number) => {
  const userRepo = new UserRepository(prisma);
  try {
    const deleteUser = await userRepo.deleteUser(id);
    if (!deleteUser) {
      return null;
    } else {
      return deleteUser;
    }
  } catch (error) {
    throw error;
  }
};

//soft delete user
export const softDeleteUser = async (id: number) => {
  const userRepo = new UserRepository(prisma);
  try {
    const deleteUser = await userRepo.softDeleteUser(id);
    if (!deleteUser) {
      return null;
    } else {
      return deleteUser;
    }
  } catch (error) {
    throw error;
  }
};
