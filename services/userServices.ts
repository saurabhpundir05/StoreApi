import { UserRepository } from "../repositories/user.repository";
import { users } from "../generated/prisma/client";

const userRepo = new UserRepository();

// Signup
export const createNewUser = async (
  id: number,
  name: string,
  password: string
): Promise<users> => {
  return userRepo.create({ id, name, password, isDeleted: false });
};

// Find user by ID
export const findUserById = (id: number) => userRepo.findUserById(id);

// Login user
export const loginUser = (id: number | string) => userRepo.loginUser(id);

// Hard delete
export const deleteUserAccount = (id: number) => userRepo.deleteUser(id);

// Soft delete
export const softDeleteUserAccount = (id: number) =>
  userRepo.softDeleteUser(id);

// Update user details
export const updateUserDetails = (id: number, name: string, password: string) =>
  userRepo.updateUserDetails(id, name, password);

// Check soft-deleted
export const checkusersoftdeleted = (id: number | string) =>
  userRepo.checkSoftDeletedUser(id);

// Activate soft delete
export const activatesoftdeleteuser = (id: number) =>
  userRepo.activateSoftDeletedUser(id);
