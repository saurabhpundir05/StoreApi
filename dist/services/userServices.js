"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserDetails = exports.softDeleteUserAccount = exports.deleteUserAccount = exports.loginUser = exports.createNewUser = exports.findUserById = void 0;
const prismaDbConnection_1 = require("../models/prismaDbConnection");
// Find user by ID
const findUserById = async (id) => {
    return prismaDbConnection_1.prisma.users.findUnique({
        where: { id },
        select: { id: true },
    });
};
exports.findUserById = findUserById;
// Create new user
const createNewUser = async (id, name, password) => {
    return prismaDbConnection_1.prisma.users.create({
        data: {
            id,
            name,
            password,
            isDeleted: false,
        },
    });
};
exports.createNewUser = createNewUser;
const loginUser = async (id //This function returns a Promise that resolves to either a LoginUserResult
) => {
    const user = await prismaDbConnection_1.prisma.users.findFirst({
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
exports.loginUser = loginUser;
//user account hard delete
const deleteUserAccount = async (id) => {
    const result = await prismaDbConnection_1.prisma.users.deleteMany({
        where: {
            id,
            isDeleted: false,
        },
    });
    return { affectedRows: result.count };
};
exports.deleteUserAccount = deleteUserAccount;
//soft delete user account
const softDeleteUserAccount = async (id) => {
    const result = await prismaDbConnection_1.prisma.users.updateMany({
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
exports.softDeleteUserAccount = softDeleteUserAccount;
// update username and password
const updateUserDetails = async (id, name, password) => {
    const result = await prismaDbConnection_1.prisma.users.updateMany({
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
exports.updateUserDetails = updateUserDetails;
