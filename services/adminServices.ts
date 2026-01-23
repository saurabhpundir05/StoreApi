//#region imports
import { emitWarning } from "node:process";
import { prisma } from "../models/prismaDbConnection";
import { AdminRepository } from "../repositories/admin.repository";
//#endregion

//#region Services

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
export const getAdminDetailById = async (id: number) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const loginAdmin = await adRepo.getAdminDetailById(id);
    if (loginAdmin) {
      return loginAdmin;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

//update user name and password
export const updateAdmin = async (
  id: number,
  email: string,
  name: string,
  password: string,
) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const updateAdmin = await adRepo.updateAdmin(id, email, name, password);
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
export const deleteAdmin = async (id: number) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const deleteAdmin = await adRepo.deleteAdmin(id);
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
export const softDeleteAdmin = async (id: number) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const deleteAdmin = await adRepo.softDeleteAdmin(id);
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
