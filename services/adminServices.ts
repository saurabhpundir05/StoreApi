import { prisma } from "../models/prismaDbConnection";
import { AdminRepository } from "../repositories/admin.repository";

//signup
export const insertAdmin = async (
  id: number,
  name: string,
  password: string
) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const insertAdmin = await adRepo.insertAdmin(id, name, password);
    if (!insertAdmin) {
      return null;
    } else {
      return insertAdmin;
    }
  } catch (error) {
    throw error;
  }
};

//login
export const getAdminDetail = async (id: number) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const loginAdmin = await adRepo.getAdminDetail(id);
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
  name: string,
  password: string
) => {
  const adRepo = new AdminRepository(prisma);
  try {
    const updateAdmin = await adRepo.updateAdmin(id, name, password);
    if (!updateAdmin) {
      return null;
    } else {
      return updateAdmin;
    }
  } catch (error) {
    throw error;
  }
};

//hard delete user
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

//soft delete user
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
