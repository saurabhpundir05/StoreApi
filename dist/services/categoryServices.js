"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategories = exports.insertNewCategories = void 0;
const prismaDbConnection_1 = require("../models/prismaDbConnection");
//insert new category
const insertNewCategories = async (name) => {
    try {
        const category = await prismaDbConnection_1.prisma.category.create({
            data: {
                c_name: name,
            },
        });
        return category;
    }
    catch (err) {
        throw err;
    }
};
exports.insertNewCategories = insertNewCategories;
// delete category
const deleteCategories = async (id) => {
    try {
        const deleted = await prismaDbConnection_1.prisma.category.deleteMany({
            where: { c_id: id },
        });
        if (deleted.count === 0) {
            throw new Error("Category not found");
        }
    }
    catch (err) {
        throw err;
    }
};
exports.deleteCategories = deleteCategories;
