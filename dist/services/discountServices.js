"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyDiscount = exports.deleteDiscounts = exports.insertDiscounts = void 0;
const prismaDbConnection_1 = require("../models/prismaDbConnection");
//insert discounts on products
const insertDiscounts = async (id, type) => {
    try {
        const discount = await prismaDbConnection_1.prisma.discount.create({
            data: {
                p_id: id,
                d_type: type,
            },
        });
        return discount;
    }
    catch (err) {
        throw err;
    }
};
exports.insertDiscounts = insertDiscounts;
//delete discounts on products
const deleteDiscounts = async (id) => {
    try {
        const deleted = await prismaDbConnection_1.prisma.discount.deleteMany({
            where: { d_id: id },
        });
        if (deleted.count === 0) {
            throw new Error("Discount not found");
        }
    }
    catch (err) {
        throw err;
    }
};
exports.deleteDiscounts = deleteDiscounts;
//modify discount on products
const modifyDiscount = async (d_id, d_type) => {
    try {
        const result = await prismaDbConnection_1.prisma.discount.updateMany({
            where: { d_id },
            data: { d_type },
        });
        if (result.count === 0) {
            return null; // No discount found to update
        }
        return { message: "Discount type updated successfully", d_id };
    }
    catch (err) {
        throw err;
    }
};
exports.modifyDiscount = modifyDiscount;
