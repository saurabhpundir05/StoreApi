//#region imports
import { prisma } from "../models/prisma";
import { AdminRepository } from "../repositories/admin.repository";
import { CartRepository } from "../repositories/cart.repository";
//#endregion

//#region Services

//signup using Google OAuth
export const createNewAdminOAuth = async (
  name: string,
  email: string,
  TokenId: string,
) => {
  const userRepo = new AdminRepository(prisma);
  try {
    const createAdmin = await userRepo.insertAdminOAuth(name, email, TokenId);
    if (!createAdmin) {
      return null;
    } else {
      return createAdmin;
    }
  } catch (error) {
    throw error;
  }
};

//signup- used to create a new admin
export const insertAdmin = async (
  email: string,
  name: string,
  password: string,
) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const insertAdmin = await adRepo.insertAdmin(email, name, password);
    if (!insertAdmin) {
      return null;
    } else {
      return insertAdmin;
    }
  } catch (error) {
    throw error;
  }
};

//login - gets admin details by email return name, id, email, password
export const getAdminDetail = async (email: string) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const loginAdmin = await adRepo.getAdminDetail(email);
    if (loginAdmin) {
      return loginAdmin;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

//get getAdminDetailById
export const getAdminDetailById = async (adminId: number) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const loginAdmin = await adRepo.getAdminDetailById(adminId);
    if (loginAdmin) {
      return loginAdmin;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

//get Admin detail by GoogleID
export const getAdminDetailByGoogleId = async (TokenId: string) => {
  const userRepo = new AdminRepository(prisma);
  try {
    const getAdminDetailByGoogleId = await userRepo.getAdminByGoogleID(TokenId);
    return getAdminDetailByGoogleId;
  } catch (err) {
    throw err;
  }
};

//get user cart history
export const getAllAdminDetails = async (adminId: number) => {
  const cartRepo = new CartRepository(prisma);
  return await cartRepo.getAllAdminDetails(adminId);
};

//update user name and password
export const updateAdmin = async (
  adminId: number,
  email: string,
  name: string,
  password: string,
) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const updateAdmin = await adRepo.updateAdmin(
      adminId,
      email,
      name,
      password,
    );
    if (!updateAdmin) {
      return null;
    } else {
      return updateAdmin;
    }
  } catch (error) {
    throw error;
  }
};

//hard delete admin - permanently delete admin from database
export const deleteAdmin = async (adminId: number) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const deleteAdmin = await adRepo.deleteAdmin(adminId);
    if (!deleteAdmin) {
      return null;
    } else {
      return deleteAdmin;
    }
  } catch (error) {
    throw error;
  }
};

//soft delete admin - admin id is deactivated
export const softDeleteAdmin = async (adminId: number) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const deleteAdmin = await adRepo.softDeleteAdmin(adminId);
    if (!deleteAdmin) {
      return null;
    } else {
      return deleteAdmin;
    }
  } catch (error) {
    throw error;
  }
};
//#endregion
