import { prisma } from "../models/prismaDbConnection";

// Find user by ID
export const findUserById = async (id: number) => {
  return prisma.users.findUnique({
    where: { id },
    select: { id: true },
  });
};

// Create new user
export const createNewUser = async (
  id: number,
  name: string,
  password: string
) => {
  return prisma.users.create({
    data: {
      id,
      name,
      password,
      isDeleted: false,
    },
  });
};

//check for id and log in
//Using an interface ensures TypeScript checks that any object returned matches this shape.
export interface LoginUserResult {
  id: number | string;
  name: string;
  password: string;
}
export const loginUser = async (
  id: number | string //This function returns a Promise that resolves to either a LoginUserResult
): // object or null (if no user is found).
Promise<LoginUserResult | null> => {
  const user = await prisma.users.findFirst({
    where: {
      id: typeof id === "string" ? Number(id) : id,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      password: true,
    },
  });
  return user;
};

//user account hard delete
export const deleteUserAccount = async (
  id: number
): Promise<{ affectedRows: number }> => {
  const result = await prisma.users.deleteMany({
    where: {
      id,
      isDeleted: false,
    },
  });
  return { affectedRows: result.count };
};

//soft delete user account
export const softDeleteUserAccount = async (
  id: number
): Promise<{ affectedRows: number }> => {
  const result = await prisma.users.updateMany({
    where: {
      id,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });
  return { affectedRows: result.count };
};

// update username and password
export const updateUserDetails = async (
  id: number,
  name: string,
  password: string
): Promise<{ affectedRows: number }> => {
  const result = await prisma.users.updateMany({
    where: {
      id,
      isDeleted: false, // soft-deleted users cannot update
    },
    data: {
      name,
      password,
    },
  });
  return { affectedRows: result.count };
};
