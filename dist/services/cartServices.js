"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllRecords = exports.addToCart = void 0;
const prismaDbConnection_1 = require("../models/prismaDbConnection");
//     //steps
//     //check if product exist in product table.
//     //check for stock quantity if it is avaialble for input quantity
//     //if available then decrease the quantity from stock table
//     //also check if their exist any discount for the given Product
//     //if exist check what is type flat or Percent
//     //final p_price will be quantity*price - flat amount or percent on product
//     //now update fields of cart p_id p_name price from product table
//     //quantity from input quantity ,d_type from discount table
//     //d_value percent or flat what is thier Number
//     //t_price .
const addToCart = async (items) => {
    const response = [];
    for (const item of items) {
        const product = await prismaDbConnection_1.prisma.product.findFirst({
            where: { p_name: item.p_name },
        });
        if (!product) {
            throw new Error("Product not found");
        }
        const stock = await prismaDbConnection_1.prisma.stock.findUnique({
            where: { p_id: product.p_id },
        });
        if (!stock) {
            throw new Error("Stock not available");
        }
        if (Number(stock.quantity) < item.quantity) {
            throw new Error("Insufficient stock");
        }
        await prismaDbConnection_1.prisma.stock.update({
            where: { p_id: product.p_id },
            data: {
                quantity: Number(stock.quantity) - item.quantity,
            },
        });
        const discount = await prismaDbConnection_1.prisma.discount.findUnique({
            where: { p_id: product.p_id },
        });
        const discountValue = await prismaDbConnection_1.prisma.discountValues.findFirst({
            where: { d_id: discount?.d_id },
        });
        let d_type = "NO DISCOUNT";
        let d_value = 0;
        const price = Number(product.price);
        if (discount?.d_type) {
            d_type = discount.d_type;
            if (d_type === "FLAT") {
                d_value = Number(discountValue?.d_flat);
            }
            if (d_type === "PERCENT") {
                d_value = Number(discountValue?.d_percent);
            }
        }
        let t_price = price * item.quantity;
        if (d_type === "FLAT") {
            t_price -= d_value;
        }
        if (d_type === "PERCENT") {
            t_price -= (t_price * d_value) / 100;
        }
        if (t_price < 0)
            t_price = 0;
        await prismaDbConnection_1.prisma.cart.upsert({
            where: { p_id: product.p_id },
            update: {
                quantity: item.quantity,
                d_type,
                d_value,
                t_price,
            },
            create: {
                p_id: product.p_id,
                p_name: product.p_name,
                price,
                quantity: item.quantity,
                d_type,
                d_value,
                t_price,
            },
        });
        response.push({
            p_name: item.p_name,
            success: true,
            total_price: t_price,
        });
    }
    return response;
};
exports.addToCart = addToCart;
//delete all records
const deleteAllRecords = async () => {
    const result = await prismaDbConnection_1.prisma.cart.deleteMany({});
    return result;
};
exports.deleteAllRecords = deleteAllRecords;
