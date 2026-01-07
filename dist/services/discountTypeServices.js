"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertDiscountsTypes = void 0;
const prismaDbConnection_1 = require("../models/prismaDbConnection");
const insertDiscountsTypes = async (data) => {
    data.validate();
    const prismaData = {
        d_id: data.id,
        d_flat: data.flat ?? null,
        d_percent: data.percent ?? null,
    };
    const discountType = await prismaDbConnection_1.prisma.discountValues.create({
        data: prismaData,
    });
    return discountType;
};
exports.insertDiscountsTypes = insertDiscountsTypes;
