//#region imports
import { prisma } from "../models/prisma";
import { UserRepository } from "../repositories/users.repository";
import { CartRepository } from "../repositories/cart.repository";
//#endregion

//#region User Services

//signup
export const createNewUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const userRepo = new UserRepository(prisma);
  try {
    const createUser = await userRepo.insertUser(name, email, password);
    if (!createUser) {
      return null;
    } else {
      return createUser;
    }
  } catch (error) {
    throw error;
  }
};

//signup using Google OAuth
export const createNewUserOAuth = async (
  name: string,
  email: string,
  TokenId: string,
) => {
  const userRepo = new UserRepository(prisma);
  try {
    const createUser = await userRepo.insertUserOAuth(name, email, TokenId);
    if (!createUser) {
      return null;
    } else {
      return createUser;
    }
  } catch (error) {
    throw error;
  }
};

//Get user details by email
export const getUserDetail = async (email: string) => {
  const userRepo = new UserRepository(prisma);
  try {
    const loginUser = await userRepo.getUserDetail(email);
    if (loginUser) {
      return loginUser;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

//get user details by Id
export const getUserDetailById = async (id: string) => {
  const userRepo = new UserRepository(prisma);
  try {
    const loginUser = await userRepo.getUserDetailById(id);
    if (loginUser) {
      return loginUser;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

//check email if exist or not
export const checkUserEmail = async (email: string) => {
  const userRepo = new UserRepository(prisma);
  try {
    const loginUser = await userRepo.checkUserEmail(email);
    if (loginUser) {
      return loginUser;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

//get UserDetail by GoogleID
export const getUserDetailByGoogleId = async (TokenId: string) => {
  const userRepo = new UserRepository(prisma);
  try {
    const getUserDetailByGoogleId = await userRepo.getUserByGoogleID(TokenId);
    return getUserDetailByGoogleId;
  } catch (err) {
    throw err;
  }
};

//get user cart history
export const getAllUserDetails = async (id: string) => {
  const cartRepo = new CartRepository(prisma);
  return await cartRepo.getAllPersonDetails(id);
};

//update user name and password
export const updateUser = async (
  id: string,
  name: string,
  email: string,
  password: string,
) => {
  const userRepo = new UserRepository(prisma);
  try {
    const updateUser = await userRepo.updateUser(id, name, email, password);
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
export const deleteUser = async (id: string) => {
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
export const softDeleteUser = async (id: string) => {
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
//#endregion
